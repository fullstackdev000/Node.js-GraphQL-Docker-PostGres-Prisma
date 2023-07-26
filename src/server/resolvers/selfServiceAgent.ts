import { prisma } from '#veewme/gen/prisma'
import { hashPassword } from '#veewme/helpers/password'
import { ResolversRequired } from '../graphqlServer'

export const SelfServiceAgent: ResolversRequired['SelfServiceAgent'] = {
  user: parent => prisma.selfServiceAgent({ id: parent.id }).user()
}

export const createSelfServiceAgent
: ResolversRequired['Mutation']['createSelfServiceAgent'] = async (obj, args, context, info) => {
  const { user, ...data } = args.data
  let password
  try {
    password = hashPassword(user.password)
  } catch (error) {
    return error
  }
  const agent = await prisma.createSelfServiceAgent({
    ...data,
    user: { create: {
      ...user,
      password,
      role: 'SELFSERVICEAGENT'
    }}
  })
  return agent
}
