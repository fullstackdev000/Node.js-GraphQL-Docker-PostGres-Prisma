import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { ApolloError } from 'apollo-server-express'
import * as payments from '../../payments/stripe'

export const createPaymentIntentForAgent = async (
  agent: PrismaTypes.Agent,
  amount: number,
  paymentMethodId?: string | null,
  savePaymentMethod?: boolean | null
) => {
  let intent
  let agentObj = agent

  if (!agentObj.stripeCustomerId) {
    const user = await prisma.agent({ id: agent.id }).user()
    const name = `${user.firstName} ${user.lastName}`
    const stripeCustomer = await payments.createCustomer(user.email, 'AGENT', name)
    agentObj = await prisma.updateAgent({
      data: { stripeCustomerId: stripeCustomer.id },
      where: { id: agent.id }
    })
  }

  if (agentObj.stripeCustomerId) {
    try {
      intent = await payments.createPaymentIntent(
        amount,
        agentObj.stripeCustomerId,
        paymentMethodId,
        savePaymentMethod,
        { agent: agent.id }
      )
    } catch (err) {
      console.error(err)  // tslint:disable-line
      throw new ApolloError(err, err.code)
    }
  }
  return intent && intent.client_secret ? intent.client_secret : ''
}

export const createPaymentIntentForAffiliate = async (
  affiliate: PrismaTypes.Affiliate,
  amount: number,
  paymentMethodId?: string | null,
  savePaymentMethod?: boolean | null
) => {
  let intent
  let affiliateObj = affiliate

  if (!affiliateObj.stripeCustomerId) {
    const user = await prisma.affiliate({ id: affiliate.id }).user()
    const name = `${user.firstName} ${user.lastName}`
    const stripeCustomer = await payments.createCustomer(user.email, 'AFFILIATE', name)
    affiliateObj = await prisma.updateAffiliate({
      data: { stripeCustomerId: stripeCustomer.id },
      where: { id: affiliate.id }
    })
  }

  if (affiliateObj.stripeCustomerId) {
    try {
      intent = await payments.createPaymentIntent(
        amount,
        affiliateObj.stripeCustomerId,
        paymentMethodId,
        savePaymentMethod,
        { agent: affiliate.id }
      )
    } catch (err) {
      console.error(err) // tslint:disable-line
      throw new ApolloError(err, err.code)
    }
  }
  return intent && intent.client_secret ? intent.client_secret : ''
}
