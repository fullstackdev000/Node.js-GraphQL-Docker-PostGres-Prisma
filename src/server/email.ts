import * as PrismaTypes from '#veewme/gen/prisma'
import * as sendgrid from '@sendgrid/mail'
import * as path from 'path'

sendgrid.setApiKey(process.env.SENDGRID_KEY || '')

const PUBLIC_URL = process.env.PUBLIC_URL

// Templates
const SENDGRID_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID
const SENDGRID_RESET_PASSWORD_TEMPLATE_ID = process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID
const SENDGRID_TEMPLATE_SPLIT_PAYMENT_FINALIZE = process.env.SENDGRID_TEMPLATE_SPLIT_PAYMENT_FINALIZE
const SENDGRID_TEMPLATE_NEW_USER = process.env.SENDGRID_TEMPLATE_NEW_USER

// Other settings
const SENDGRID_FROM = process.env.SENDGRID_FROM || ''
const PATH_FINALIZE_SPLIT_PAYMENT = 'panel/finalize-split-payment'

/** Send an email and log the error message if it occurs. */
const sendEmail = async (data: any) => {
  if (!process.env.SENDGRID_KEY) {
    console.log('Email delivery debug: ', data) // tslint:disable-line
  }

  try {
    await sendgrid.send(data)
  } catch (error) {
    console.error('Email failed: ', error) // tslint:disable-line
  }
}
export const sendResetPasswordEmail = async (targetEmail: string, token: string, time: Date) => {
  const data = {
    dynamicTemplateData: {
      time,
      token,
      Weblink: `${PUBLIC_URL}/auth/set-password?token=${token}`
    },
    from: SENDGRID_FROM,
    templateId: SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
    to: targetEmail
  }
  await sendEmail(data)
}

/** Send the welcome email.
 * @param targetEmail - recipient's email address
 * @param name - name of a user to use in the email template
 */
export const sendWelcomeAffiliateEmail = async (targetEmail: string, name: string, password: string) => {
  const data = {
    dynamicTemplateData: {
      name,
      password
    },
    from: SENDGRID_FROM,
    templateId: SENDGRID_TEMPLATE_ID,
    to: targetEmail
  }
  await sendEmail(data)
}

export const sendWelcomeUserEmail = async (targetEmail: string, name: string, password: string) => {
  const data = {
    dynamicTemplateData: {
      name,
      password
    },
    from: SENDGRID_FROM,
    templateId: SENDGRID_TEMPLATE_NEW_USER,
    to: targetEmail
  }
  await sendEmail(data)
}

export const sendPaymentSucceededEmail = async (targetEmail: string) => {
  console.log(`Send payment succeeded email to ${targetEmail}`) // tslint:disable-line
  // TODO: Add Sendgrid template.
}

export const sendPaymentFailedEmail = async (targetEmail: string) => {
  console.log(`Send payment failed email to ${targetEmail}`) // tslint:disable-line
  // TODO: Add Sendgrid template.
}

/** Send the order activation email. */
export const sendOrderActivationEmail = async (targetEmail: string) => {
  console.log(`Send order confirmation email to ${targetEmail}`) // tslint:disable-line
  // TODO: Add Sendgrid template.
}

export const sendSplitPaymentSecondPaymentLink = async (
  targetEmail: string,
  payment: PrismaTypes.Payment,
  host: string
) => {
  if (!SENDGRID_TEMPLATE_SPLIT_PAYMENT_FINALIZE) {
    console.error('Email delivery failed: SENDGRID_TEMPLATE_SPLIT_PAYMENT_FINALIZE is not set.') // tslint:disable-line
    return
  }
  if (!payment.paymentLinkId) {
    console.error(`Email delivery failed: UUID token not set for payment: id:${payment.id}, secret:${payment.clientSecret}`)  // tslint:disable-line
    return
  }

  const paymentLink = new URL(host)
  paymentLink.pathname = path.join(PATH_FINALIZE_SPLIT_PAYMENT, payment.paymentLinkId)
  paymentLink.search = `?amount=${payment.amount}`

  const data = {
    dynamicTemplateData: {
      paymentLink: paymentLink.href
    },
    from: SENDGRID_FROM,
    templateId: SENDGRID_TEMPLATE_SPLIT_PAYMENT_FINALIZE,
    to: targetEmail
  }
  await sendEmail(data)
}

export const sendZippingCompletedEmail = async (targetEmail: string, link: string) => {
  const data = {
    dynamicTemplateData: {
      subject: 'Zipping of selected files are completed!',
      zipDownloadLink: link
    },
    from: SENDGRID_FROM,
    templateId: SENDGRID_TEMPLATE_ID,
    to: targetEmail
  }
  await sendEmail(data)
}
