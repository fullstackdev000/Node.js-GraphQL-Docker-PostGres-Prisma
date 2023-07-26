/* tslint:disable:no-console */
import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { UnreachableCaseError } from '#veewme/lib/error'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server-express'
import { ResolversRequired } from '../../graphqlServer'
import * as payments from '../../payments/stripe'
import { ordersByRole } from '../orders'
import { getObjectOrError } from '../utils'
import { createPaymentIntentForAffiliate, createPaymentIntentForAgent } from './utils'

export const Payment: ResolversRequired['Payment'] = {
  affiliate: async parent => prisma.payment({ id: parent.id }).affiliate(),
  agentPrimary: async parent => prisma.payment({ id: parent.id }).agentPrimary(),
  agentSecondary: async parent => prisma.payment({ id: parent.id }).agentSecondary(),
  order: async parent => prisma.payment({ id: parent.id }).order()
}

const validateOrderPaymentAmount = (paymentAmount: number, order: PrismaTypes.Order) => {
  if (paymentAmount < order.price) {
    throw new UserInputError('Provided amount does not cover order price.')
  }
}

export const createPayment: ResolversRequired['Mutation']['createPayment'] = async (_, args, context) => {
  const {
    data: { amount, orderId, paymentMethodId, savePaymentMethod, type }
  } = args

  let agent
  let affiliate

  // Handle assigning agent and affiliate object depending on who's running the mutation.
  if (context.role === 'AGENT') {
    agent = await prisma.agent({ id: context.accountId })
    if (!agent) {
      throw new Error(`Agent not found: ${context.accountId}`)
    }
    affiliate = await prisma.agent({ id: context.accountId }).affiliate()
    if (!affiliate) {
      throw new UserInputError('Failed to get the related affiliate account.')
    }
  } else if (context.role === 'AFFILIATE') {
    affiliate = await prisma.affiliate({ id: context.accountId })
    if (!affiliate) {
      throw new Error(`Affiliate not found: ${context.accountId}`)
    }
    agent = undefined
  } else {
    throw new ForbiddenError('You have no access to this action.')
  }

  // Get the order, if the payment is being create for a specific orderId.
  let order
  if (orderId) {
    order = await getObjectOrError<PrismaTypes.Order>(
      ordersByRole<PrismaTypes.Order>({ where: { id: orderId } }, context)
    )

    // Get existing order payments and check if a new one can be created. If there are already payments of a different
    // type, a new one cannot be created.
    const orderPayments = await prisma.payments({ where: { order: { id: orderId }, type_not: type } })
    if (orderPayments.length) {
      throw new UserInputError(
        `Cannot create payment of type: ${type}. There are already payments of a different type for this order.`
      )
    }

    // Check if order is already paid.
    if (order.statusPaid) {
      throw new UserInputError('Cannot create payment - this order is already paid.')
    }
  }

  let clientSecret
  let payment

  switch (type) {
    case 'GENERIC':
      clientSecret = await (context.role === 'AGENT' && agent
        ? createPaymentIntentForAgent(agent, amount, paymentMethodId, savePaymentMethod)
        : createPaymentIntentForAffiliate(affiliate, amount, paymentMethodId, savePaymentMethod))
      payment = await prisma.createPayment({
        affiliate: { connect: { id: affiliate.id } },
        agentPrimary: agent && { connect: { id: agent.id } },
        amount,
        clientSecret,
        order: order && { connect: { id: order.id } },
        status: 'UNPAID',
        type
      })
      break

    case 'COMPANY_PAY':
      if (!agent) {
        throw new UserInputError('This payment type can be run only by Agent')
      }
      if (!order) {
        throw new UserInputError('Order is required for payment type.')
      }
      validateOrderPaymentAmount(amount, order)
      payment = await prisma.createPayment({
        affiliate: { connect: { id: affiliate.id } },
        agentPrimary: { connect: { id: agent.id } },
        amount,
        order: { connect: { id: order.id } },
        status: 'UNPAID',
        type
      })
      break

    case 'ON_DELIVERY':
      if (!agent) {
        throw new UserInputError('This payment type can be run only by Agent')
      }
      if (!order) {
        throw new UserInputError('Order is required for payment type.')
      }
      validateOrderPaymentAmount(amount, order)
      payment = await prisma.createPayment({
        affiliate: { connect: { id: affiliate.id } },
        agentPrimary: { connect: { id: agent.id } },
        amount,
        order: { connect: { id: order.id } },
        status: 'UNPAID',
        type
      })
      break

    case 'ON_ORDER':
      if (!agent) {
        throw new UserInputError('This payment type can be run only by Agent')
      }
      if (!order) {
        throw new UserInputError('Order is required for payment type.')
      }
      validateOrderPaymentAmount(amount, order)
      clientSecret = await createPaymentIntentForAgent(agent, amount, paymentMethodId, savePaymentMethod)
      payment = await prisma.createPayment({
        affiliate: { connect: { id: affiliate.id } },
        agentPrimary: { connect: { id: agent.id } },
        amount,
        clientSecret,
        order: { connect: { id: order.id } },
        status: 'UNPAID',
        type
      })
      break

    case 'SPLIT_PAYMENT':
      if (!agent) {
        throw new UserInputError('This payment type can be run only by Agent')
      }
      if (!order) {
        throw new UserInputError('Order is required for payment type.')
      }
      // Validate that `order.realEstate` has primary and secondary agents assigned.
      const agentPrimary = await prisma
        .order({ id: order.id })
        .realEstateId()
        .agentPrimaryId()
      const agentSecondary = await prisma
        .order({ id: order.id })
        .realEstateId()
        .agentCoListingId()
      if (!agentPrimary || !agentSecondary) {
        throw new UserInputError('Order real estate needs two agents assigned to use split payment.')
      }
      // TODO: validate that agent is one of primary or secondary?

      clientSecret = await createPaymentIntentForAgent(agent, amount, paymentMethodId, savePaymentMethod)
      payment = await prisma.createPayment({
        affiliate: { connect: { id: affiliate.id } },
        agentPrimary: { connect: { id: agentPrimary.id } },
        agentSecondary: { connect: { id: agentSecondary.id } },
        amount,
        clientSecret,
        order: { connect: { id: order.id } },
        status: 'UNPAID',
        type
      })
      break

    default:
      throw new UnreachableCaseError(type)
  }

  return { clientSecret, payment }
}

export const updatePayment: ResolversRequired['Mutation']['updatePayment'] = async (_, args, context) => {
  const {
    id,
    input: { status }
  } = args
  const payment = (await prisma.affiliate({ id: context.accountId }).payments({ where: { id } }))[0]
  if (!payment) {
    throw new UserInputError(`No payment with ID:${id} found.`)
  }

  return prisma.updatePayment({ data: { status }, where: { id } })
}

export const finalizeSplitPayment: ResolversRequired['Mutation']['finalizeSplitPayment'] = async (_, args, context) => {
  if (context.role !== 'AGENT') {
    throw new ForbiddenError('This operation is only supported for agents.')
  }

  const { paymentLinkId, paymentMethodId, savePaymentMethod } = args.data

  // The `agent` is the agent who's running the mutation.
  const agent = await getObjectOrError<PrismaTypes.Agent>(prisma.agents({ where: { id: context.accountId } }))

  const payment = (await prisma.payments({ where: { paymentLinkId } }))[0]
  if (!payment) {
    throw new UserInputError('No payment found')
  }

  const secondaryAgent = await prisma.payment({ id: payment.id }).agentSecondary()
  if (secondaryAgent.id !== agent.id) {
    throw new UserInputError('Invalid agent ID')
  }

  const clientSecret = await createPaymentIntentForAgent(agent, payment.amount, paymentMethodId, savePaymentMethod)

  await prisma.updatePayment({ data: { clientSecret }, where: { id: payment.id } })
  return { clientSecret, payment }
}

export const createPaymentSetupIntent: ResolversRequired['Mutation']['createPaymentSetupIntent'] = async (
  _,
  __,
  context,
  info
) => {
  let clientSecret
  if (context.role !== 'AGENT') {
    return { clientSecret, payment: {} }
  }

  const agent = await prisma.agent({ id: context.accountId })
  if (!agent) {
    throw new Error(`Agent not found: ${context.accountId}`)
  }

  if (agent.stripeCustomerId) {
    let intent
    try {
      intent = await payments.createSetupIntent(agent.stripeCustomerId)
    } catch (err) {
      console.error(err)
      throw new ApolloError(err, err.status)
    }
    clientSecret = intent && intent.client_secret ? intent.client_secret : ''
  }
  return { clientSecret }
}

export const resolvePaymentMethods = async (parent: Partial<GraphqlTypes.Agent | GraphqlTypes.Affiliate>) => {
  if (!parent.stripeCustomerId) return []

  let creditCards
  try {
    creditCards = await payments.listCreditCards(parent.stripeCustomerId)
  } catch (err) {
    console.error(err)
  }

  if (!creditCards) return []

  return creditCards.data.map(paymentMethod => ({
    card: paymentMethod.card && {
      brand: paymentMethod.card.brand,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
      last4: paymentMethod.card.last4
    },
    id: paymentMethod.id,
    type: paymentMethod.type
  }))
}
