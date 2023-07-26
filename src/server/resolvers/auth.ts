import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import { isValidPassword } from '#veewme/helpers/password'
import { UnreachableCaseError } from '#veewme/lib/error'
import { Context } from '#veewme/lib/types'
import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { ResolversRequired } from '../graphqlServer'

export const Account: ResolversRequired['Account'] = {
  account: async (parent, args, context, info) => {
    const accountQuery = getAccountQuery(context, parent.role)
    return (await accountQuery({ where: { id: context.accountId } }))[0]
  },
  firstName: async (parent, args, context, info) => {
    const user = await context.prismaBinding.query.user({ where: { id: context.userId } })
    return user.firstName
  },
  lastName: async (parent, args, context, info) => {
    const user = await context.prismaBinding.query.user({ where: { id: context.userId } })
    return user.lastName
  }
}

const getAccountQuery = (context: Context, role?: GraphqlTypes.Role) => {
  let queryAccounts
  switch (role) {
    case 'ADMIN': queryAccounts = context.prismaBinding.query.admins; break
    case 'AFFILIATE': queryAccounts = context.prismaBinding.query.affiliates; break
    case 'AGENT': queryAccounts = context.prismaBinding.query.agents; break
    case 'DEVELOPER': queryAccounts = context.prismaBinding.query.developers; break
    case 'PHOTOGRAPHER': queryAccounts = context.prismaBinding.query.photographers; break
    case 'PROCESSOR': queryAccounts = context.prismaBinding.query.processors; break
    case 'SELFSERVICEAGENT': queryAccounts = context.prismaBinding.query.selfServiceAgents; break
    case undefined: throw new UserInputError('Undefined role')
    default: throw new UnreachableCaseError(role)
  }
  return queryAccounts
}

export const logIn: ResolversRequired['Mutation']['logIn'] = async (obj, { data }, context, info) => {
  const user: GraphqlTypes.User = await context.prismaBinding.query.user({ where: { email: data.email } })
  if (!user || !isValidPassword(data.password, user.password)) {
    throw new AuthenticationError('Bad credentials')
  }

  const accountQuery = getAccountQuery(context, user.role)
  const accounts = await accountQuery({ where: { user: { email: data.email } } })

  const promise = new Promise(resolve => {
    if (context.request && context.request.session) {
      context.request.session.accountId = accounts[0].id
      context.request.session.role = user.role
      context.request.session.userId = user.id

      context.request.session.save(() => {
        resolve()
      })
    } else {
      resolve()
    }
  })

  await promise
  await prisma.updateUser({
    data: {
      lastLogIn: new Date()
    },
    where: {
      id: user.id
    }
  })
  return user
}

export const logOut: ResolversRequired['Mutation']['logOut'] = (obj, args, context) => {
  if (context.request && context.request.session) {
    context.request.session = undefined
  }

  return true
}

export const me: ResolversRequired['Query']['me'] = async (obj, args, context, info) => {
  if (!context.accountId || !context.role) {
    throw new Error('Not logged in') // TODO proper error handling
  }

  let queryAccount
  switch (context.role) {
    case 'ADMIN': queryAccount = context.prismaBinding.query.admin; break
    case 'AFFILIATE': queryAccount = context.prismaBinding.query.affiliate; break
    case 'AGENT': queryAccount = context.prismaBinding.query.agent; break
    case 'DEVELOPER': queryAccount = context.prismaBinding.query.developer; break
    case 'PHOTOGRAPHER': queryAccount = context.prismaBinding.query.photographer; break
    case 'PROCESSOR': queryAccount = context.prismaBinding.query.processor; break
    case 'SELFSERVICEAGENT': queryAccount = context.prismaBinding.query.selfServiceAgent; break
    default: throw new UnreachableCaseError(context.role)
  }

  const account = await queryAccount({ where: { id: context.accountId } }, `{
    id,
    user {
      firstName
      lastName
      role
    }
  }`)

  return {
    accountId: account.id,
    ...account.user
  }
}
