import { prisma } from '#veewme/gen/prisma'
import { hashPassword, isValidPassword } from '#veewme/helpers/password'
import { sendResetPasswordEmail } from '#veewme/server/email'
import { ResolversRequired } from '#veewme/server/graphqlServer'
import crypto from 'crypto'

export const requestResetPassword: ResolversRequired['Mutation']['requestResetPassword'] = async (obj, args) => {
  const { email } = args.data
  const lowerMail = email.toLowerCase()

  const foundUser = await prisma.user({ email: lowerMail })
  if (!foundUser) throw new Error('No user found with that email.')

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date()
  resetTokenExpiry.setTime(resetTokenExpiry.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

  const foundToken = await prisma.passwordReset({ email: foundUser.email })

  if (foundToken) {
    await prisma.updatePasswordReset({
      data: {
        resetToken,
        resetTokenExpiry
      },
      where: {
        email: foundUser.email
      }
    })
  } else {
    await prisma.createPasswordReset({ email: foundUser.email, resetToken, resetTokenExpiry })
  }
  await sendResetPasswordEmail(foundUser.email, resetToken, resetTokenExpiry)
  return { email: foundUser.email }
}

export const resetPassword: ResolversRequired['Mutation']['resetPassword'] = async (obj, args) => {
  const { password, resetToken } = args.data

  const foundResetUser = await prisma.passwordReset({ resetToken })
  if (!foundResetUser) {
    throw new Error(`This token was not found`)
  }

  const lowerMail = foundResetUser.email.toLowerCase()

  const currentDate = Date.now()
  const expiryDate = Date.parse(foundResetUser.resetTokenExpiry)

  if (currentDate > expiryDate || foundResetUser.resetToken !== resetToken) {
    throw new Error(`Your password reset token is ${currentDate > expiryDate ? 'expired' : 'invalid'}.`)
  }

  const hashedPassword: string = hashPassword(password)

  const foundUser = await prisma.user({ email: lowerMail })

  if (foundUser) {
    await prisma.updateUser({
      data: {
        password: hashedPassword
      },
      where: {
        email: foundUser.email
      }
    })

    await prisma.deletePasswordReset({
      email: foundResetUser.email
    })
  } else {
    throw new Error(`This user does not exist.`)
  }
  return 'Password Successfully Changed'
}

export const updatePassword: ResolversRequired['Mutation']['updatePassword'] = async (obj, args, context) => {
  const { oldPassword, newPassword } = args.data
  const foundUser = await prisma.user({ id: context.userId })
  if (!isValidPassword(oldPassword, foundUser!.password)) throw new Error('Current password is incorrect.')
  await prisma.updateUser({
    data: {
      password: hashPassword(newPassword)
    },
    where: {
      id: context.userId
    }
  })
  return 'Password successfully changed'
}
