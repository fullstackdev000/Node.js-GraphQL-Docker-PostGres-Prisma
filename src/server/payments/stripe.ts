import { Role } from '#veewme/gen/graphqlTypes'
import { Decimal } from 'decimal.js'
import Stripe from 'stripe'

const STRIPE_SECRET = process.env.STRIPE_SECRET || ''
if (!STRIPE_SECRET) {
  console.warn('STRIPE_SECRET is not set') // tslint:disable-line:no-console
}

export const CURRENCY = 'usd'

export const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2020-08-27' })

export const toStripeAmount = (amount: number) => {
  const decimalAmount = new Decimal(amount)
  return decimalAmount.times(100).toNumber()
}

export const fromStripeAmount = (amount: number) => amount / 100

/**
 * Creates a new Stripe customer.
 * @param email Customer's email.
 * @param role Customer's role.
 */
export const createCustomer = (email: string, role: Role, name?: string) => {
  return stripe.customers.create({ email, name, metadata: { role } })
}

/**
 * Returns a list of saved credit cards for a customer.
 * @param customerId Stripe customer ID.
 */
export const listCreditCards = (customerId: string) => {
  return stripe.paymentMethods.list({
    customer: customerId,
    type: 'card'
  })
}

/**
 * Creates a new payment intent.
 * @param amount Amount intended to be collected.
 * @param customerId Stripe customer ID.
 * @param paymentMethodId Optional ID of a saved payment method to use with this payment.
 */
export const createPaymentIntent = (
  amount: number,
  customerId: string,
  paymentMethodId?: string | null,
  savePaymentMethod?: boolean | null,
  metadata?: Stripe.MetadataParam
) => {
  return stripe.paymentIntents.create({
    amount: toStripeAmount(amount),
    currency: CURRENCY,
    customer: customerId,
    metadata,
    payment_method: paymentMethodId || undefined,
    setup_future_usage: savePaymentMethod ? 'off_session' : undefined
  })
}

/**
 * Creates a new setup intent used to store payment methods.
 * @param customerId Stripe customer ID.
 */
export const createSetupIntent = (customerId: string) => {
  return stripe.setupIntents.create({ customer: customerId })
}
