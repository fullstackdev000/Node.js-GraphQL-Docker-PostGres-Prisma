// This module implements Stripe webhook (https://stripe.com/docs/webhooks).

// tslint:disable:no-console
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import Stripe from 'stripe'
import url from 'url'
import uuidv4 from 'uuid/v4'
import { sendPaymentFailedEmail, sendPaymentSucceededEmail, sendSplitPaymentSecondPaymentLink } from '../email'
import { fromStripeAmount, stripe as stripeClient } from './stripe'

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET || ''

export const stripeWebhook = async (request: any, response: any) => {
  if (!endpointSecret) {
    console.error('STRIPE_ENDPOINT_SECRET is not set') // tslint:disable-line:no-console
    return response.sendStatus(400)
  }

  let event = request.body

  const signature = request.headers['stripe-signature']
  try {
    event = stripeClient.webhooks.constructEvent(request.body, signature, endpointSecret)
  } catch (err) {
    console.error('Stripe webhook signature failed: ', err)
    return response.sendStatus(400)
  }

  const host = url.format({ protocol: request.protocol, host: request.get('host') })

  let payment: PrismaTypes.Payment
  let paymentIntent: Stripe.PaymentIntent

  switch (event.type) {
    case 'payment_intent.succeeded':
      paymentIntent = event.data.object
      payment = await getLocalPayment(paymentIntent.client_secret)
      if (!payment) {
        console.error(`No payment for client_secret: ${paymentIntent.client_secret}`)
        return response.sendStatus(400)
      }

      console.info(`Received success payment intent for client_secret: ${paymentIntent.client_secret}`)

      switch (payment.type) {
        case 'GENERIC':
          await handleGeneric(payment)
          break
        case 'ON_ORDER':
          await handleOnOrder(payment)
          break
        case 'ON_DELIVERY':
          // TODO: add support for ON_DELIVERY
          break
        case 'SPLIT_PAYMENT':
          await handleSplitPayment(payment, paymentIntent, host)
          break
        default:
          console.log(`Unhandled payment type ${payment.type}.`)
      }
      break

    case 'payment_intent.failed':
      paymentIntent = event.data.object
      payment = await getLocalPayment(paymentIntent.client_secret)
      if (!payment) {
        console.error(`No payment for client_secret: ${paymentIntent.client_secret}`)
        return response.sendStatus(400)
      }
      await handleFailedPayment(payment)
      break

    default:
      console.log(`Unhandled event type ${event.type}.`)
  }

  response.send()
}

const getLocalPayment = async (clientSecret: string | null) => {
  const payment = (await prisma.payments({ where: { clientSecret } }))[0]
  return payment
}

const handleGeneric = async (payment: PrismaTypes.Payment) => {
  const agentUser = await prisma
    .payment({ id: payment.id })
    .agentPrimary()
    .user()
  const affiliateUser = await prisma
    .payment({ id: payment.id })
    .affiliate()
    .user()
  if (agentUser) {
    await sendPaymentSucceededEmail(agentUser.email)
  }
  if (affiliateUser) {
    await sendPaymentSucceededEmail(affiliateUser.email)
  }
  await prisma.updatePayment({ where: { id: payment.id }, data: { status: 'PAID' } })
}

const handleOnOrder = async (payment: PrismaTypes.Payment) => {
  const agentUser = await prisma
    .payment({ id: payment.id })
    .agentPrimary()
    .user()
  const affiliateUser = await prisma
    .payment({ id: payment.id })
    .affiliate()
    .user()
  const order = await prisma.payment({ id: payment.id }).order()
  await Promise.all([sendPaymentSucceededEmail(agentUser.email), sendPaymentSucceededEmail(affiliateUser.email)])
  await prisma.updatePayment({ where: { id: payment.id }, data: { status: 'PAID' } })
  await prisma.updateOrder({ where: { id: order.id }, data: { statusPaid: true } })
  // TODO: change order status to TODO
}

const handleSplitPayment = async (payment: PrismaTypes.Payment, paymentIntent: Stripe.PaymentIntent, host: string) => {
  let metadataAgentId
  try {
    metadataAgentId = parseInt(paymentIntent.metadata.agent, 10)
  } catch (err) {
    console.error(`Failed to parse metadata agent ID: ${paymentIntent.metadata.agent}`)
    return
  }

  const paymentAgent = await prisma.agent({ id: metadataAgentId })
  if (!paymentAgent) {
    console.error(`Failed to get payment agent: ${metadataAgentId}`)
    return
  }

  const agentPrimary = await prisma.payment({ id: payment.id }).agentPrimary()
  const agentSecondary = await prisma.payment({ id: payment.id }).agentSecondary()
  const agentPrimaryUser = await prisma
    .payment({ id: payment.id })
    .agentPrimary()
    .user()
  const agentSecondaryUser = await prisma
    .payment({ id: payment.id })
    .agentSecondary()
    .user()

  const order = await prisma.payment({ id: payment.id }).order()

  if (paymentAgent.id === agentPrimary.id) {
    // Process the first payment
    await prisma.updatePayment({ where: { id: payment.id }, data: { status: 'PAID' } })
    await sendPaymentSucceededEmail(agentPrimaryUser.email)

    // Create the second payment
    const affiliate = await prisma.payment({ id: payment.id }).affiliate()
    const outstandingAmount = order.price - fromStripeAmount(paymentIntent.amount_received)

    const secondPayment = await prisma.createPayment({
      affiliate: { connect: { id: affiliate.id } },
      agentPrimary: { connect: { id: agentPrimary.id } },
      agentSecondary: { connect: { id: agentSecondary.id } },
      amount: outstandingAmount,
      order: { connect: { id: order.id } },
      paymentLinkId: uuidv4(),
      status: 'UNPAID',
      type: 'SPLIT_PAYMENT'
    })
    await sendSplitPaymentSecondPaymentLink(agentSecondaryUser.email, secondPayment, host)
  } else if (paymentAgent.id === agentSecondary.id) {
    // Process the second payment
    const affiliateUser = await prisma
      .payment({ id: payment.id })
      .affiliate()
      .user()
    await prisma.updatePayment({ where: { id: payment.id }, data: { status: 'PAID' } })
    await prisma.updateOrder({ where: { id: order.id }, data: { statusPaid: true } })
    await sendPaymentSucceededEmail(agentSecondaryUser.email)
    await sendPaymentSucceededEmail(affiliateUser.email)
    // TODO: Email the first agent about success of second payment
  } else {
    console.error(`Cannot complete split payment for Agent ID ${paymentAgent.id}`)
  }
}

const handleFailedPayment = async (payment: PrismaTypes.Payment) => {
  const affiliate = await prisma
    .payment({ id: payment.id })
    .affiliate()
    .user()
  const agentPrimary = await prisma
    .payment({ id: payment.id })
    .agentPrimary()
    .user()
  const agentSecondary = await prisma
    .payment({ id: payment.id })
    .agentSecondary()
    .user()
  await Promise.all([
    sendPaymentFailedEmail(affiliate.email),
    sendPaymentFailedEmail(agentPrimary.email),
    sendPaymentFailedEmail(agentSecondary.email)
  ])
}
