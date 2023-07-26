import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import { Context } from '#veewme/lib/types'
import { GraphQLResolveInfo } from 'graphql'
import { ResolversRequired } from '../graphqlServer'
import { getObjectOrError } from './utils'

export const Region: ResolversRequired['Region'] = {
  owner: parent => prisma.region({ id: parent.id }).ownerId(),
  ownerId: async parent => {
    const aff = await prisma.region({ id: parent.id }).ownerId()
    return aff.id
  }
}

const regionsByRole = async (
  argsWhere: GraphqlTypes.RegionWhereInput,
  context: Context,
  info: GraphQLResolveInfo | string
): Promise<GraphqlTypes.Region[]> => {
  const where: GraphqlTypes.RegionWhereInput = { ...argsWhere }
  if (context.role === 'AFFILIATE') {
    where.ownerId = { id: context.accountId }
  }
  return context.prismaBinding.query.regions({ where }, info)
}

export const region: ResolversRequired['Query']['region'] = (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.Region>(
    regionsByRole(args.where, context, info)
  )
}

export const regions: ResolversRequired['Query']['regions'] = (_, args, context, info) => {
  return regionsByRole(args.where || {}, context, info)
}
