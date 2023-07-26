import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import { createRandomPassword, hashPassword } from '#veewme/helpers/password'
import { Context } from '#veewme/lib/types'
import { GraphQLResolveInfo } from 'graphql'
import { sendWelcomeUserEmail } from '../email'
import { ResolversRequired } from '../graphqlServer'
import { normalizeSearch } from '../search'
import { getObjectOrError } from './utils'

export const getProcessorSearchDocument = (data: GraphqlTypes.ProcessorCreateInput | GraphqlTypes.ProcessorUpdateInput) => {
  let values: string[] = []
  if (data && data.user) {
    values = [
      data.user.firstName || '',
      data.user.lastName || '',
      data.user.firstName || ''
    ]
  }
  return normalizeSearch(values.join(' '))
}

export const Processor: ResolversRequired['Processor'] = {
  affiliate: parent => prisma.processor({ id: parent.id }).affiliateId(),
  affiliateId: async parent => {
    const aff = await prisma.processor({ id: parent.id }).affiliateId()
    return aff.id
  },
  region: parent => prisma.processor({ id: parent.id }).regionId(),
  regionId: async parent => {
    const region = await prisma.processor({ id: parent.id }).regionId()
    return region.id
  },
  user: parent => prisma.processor({ id: parent.id }).user()
}

export const createProcessor: ResolversRequired['Mutation']['createProcessor'] = async (obj, { data }, context) => {
  const { affiliateId, regionId, user, ...processorData } = data

  let plainPassword = user.password
  let notifyTempPassword = false
  if (!plainPassword) {
    plainPassword = createRandomPassword()
    notifyTempPassword = true
  }
  const hashedPassword = hashPassword(plainPassword)

  const processorObj = prisma.createProcessor({
    ...processorData,
    affiliateId: {
      connect: { id: context.accountId }
    },
    regionId: { connect: { id: regionId } },
    searchDocument: getProcessorSearchDocument(data),
    user: {
      create: {
        ...user,
        password: hashedPassword,
        role: 'PROCESSOR'
      }
    }
  })

  if (notifyTempPassword) {
    sendWelcomeUserEmail(user.email, `${user.firstName}`, plainPassword).catch(reason => {
      console.error('Failed to send the agent welcome email: ', reason)  // tslint:disable-line
    })
  }

  return processorObj
}

const getProcessorsArgs = (args: GraphqlTypes.QueryProcessorsArgs, context: Context): any => {
  const { search, ...newArgs } = args
  const where: GraphqlTypes.ProcessorWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.affiliateId = { id: context.accountId }
  }
  if (args.search) {
    const searchPhrase = normalizeSearch(args.search)
    where.searchDocument_contains = searchPhrase
  }
  newArgs.where = where
  return newArgs
}

const processorsByRole = async (
  args: GraphqlTypes.QueryProcessorsArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<any[]> => {
  const newArgs = getProcessorsArgs(args, context)
  return prisma.processors({ ...newArgs })
}

export const processor: ResolversRequired['Query']['processor'] = (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.Processor>(
    processorsByRole(args, context, info)
  )
}

export const processors: ResolversRequired['Query']['processors'] = (_, args, context, info) => {
  return processorsByRole(args, context, info)
}

export const processorsConnection: ResolversRequired['Query']['processorsConnection'] = async (_, args, context) => {
  const newArgs = getProcessorsArgs(args, context)
  const totalCount = await prisma.processorsConnection({ where: newArgs.where }).aggregate().count()
  const objects = await processorsByRole(args, context)
  return { processors: objects, totalCount }
}

export const deleteProcessor: ResolversRequired['Mutation']['deleteProcessor'] = async (_, args, context, info) => {
  const processorObj = await getObjectOrError<GraphqlTypes.Processor>(
    processorsByRole({ where: args.where }, context, info)
  )
  return prisma.deleteProcessor({ id: processorObj.id })
}

export const updateProcessor: ResolversRequired['Mutation']['updateProcessor'] = async (_, args, context, info) => {
  const { where, data } = args
  await getObjectOrError<GraphqlTypes.Processor>(
    processorsByRole({ where }, context, info)
  )

  let regionId
  if (data && data.regionId) {
    regionId = { connect: { id: data.regionId } }
  }
  let password
  try {
    // TODO: Change after pass generating will be ready
    password = data.user && data.user.password && hashPassword(data.user.password)
  } catch (error) {
    return error
  }

  return prisma.updateProcessor({
    data: {
      ...data,
      affiliateId: data && !!data.affiliateId ? { connect: { id: data.affiliateId } } : undefined,
      regionId,
      searchDocument: getProcessorSearchDocument(data),
      user: data.user && { update: {
        ...data.user,
        password
      }}
    },
    where: { id: args.where.id }
  })
}
