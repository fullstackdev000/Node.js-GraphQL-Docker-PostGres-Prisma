import * as GraphQLTypes from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import { Context } from '#veewme/lib/types'
import { GraphQLResolveInfo } from 'graphql'
import { ResolversRequired } from '../graphqlServer'
import { normalizeSearch } from '../search'
import { convertToEnabledPhotoPresetCreateManyInput, convertToEnabledPhotoPresetUpdateManyInput } from './photoDownloadPresets'
import { getObjectOrError } from './utils'

export const Office: ResolversRequired['Office'] = {
  brokerage: parent => prisma.office({ id: parent.id }).brokerage(),
  owner: parent => prisma.office({ id: parent.id }).owner(),
  region: parent => prisma.office({ id: parent.id }).region()
}

export const createOffice: ResolversRequired['Mutation']['createOffice'] = async (_, args, context) => {
  const { data: { brokerageId, ownerId, regionId, ...data } } = args
  let affiliateId
  if (context.role === 'AFFILIATE') { affiliateId = context.accountId }
  return prisma.createOffice({
    ...data,
    brokerage: { connect: { id: brokerageId } },
    owner: { connect: { id: affiliateId || ownerId } },
    photoDownloadPresets: convertToEnabledPhotoPresetCreateManyInput(data.photoDownloadPresets),
    region: { connect: { id: regionId } }  // todo: only allow regions owned by the affiliate
  })
}

const getOfficesArgs = (args: GraphQLTypes.QueryOfficesArgs, context: Context): any => {
  const { search, ...newArgs } = args
  const where: GraphQLTypes.OfficeWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.owner = { id: context.accountId }
  }
  if (args.search) {
    const searchPhrase = normalizeSearch(args.search)
    if (where.brokerage) {
      where.brokerage.searchDocument_contains = searchPhrase
    } else {
      where.brokerage = { searchDocument_contains: searchPhrase }
    }
  }
  newArgs.where = where
  return newArgs
}

const officesByRole = async (
  args: GraphQLTypes.QueryOfficesArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<GraphQLTypes.Office[]> => {
  const newArgs = getOfficesArgs(args, context)
  return context.prismaBinding.query.offices({ ...newArgs }, info)
}

export const office: ResolversRequired['Query']['office'] = async (_, args, context, info) => {
  return getObjectOrError<GraphQLTypes.Office>(
    officesByRole(args, context, info)
  )
}

export const offices: ResolversRequired['Query']['offices'] = async (_, args, context, info) => {
  return officesByRole(args, context, info)
}

export const officesConnection: ResolversRequired['Query']['officesConnection'] = async (_, args, context, info) => {
  const newArgs = getOfficesArgs(args, context)
  const totalCount = await prisma.officesConnection({ where: newArgs.where }).aggregate().count()
  const objects = await officesByRole(args, context)
  return { totalCount, offices: objects }
}

export const deleteOffice: ResolversRequired['Mutation']['deleteOffice'] = async (_, args, context, info) => {
  const officeObj = await getObjectOrError<GraphQLTypes.Office>(
    officesByRole({ where: { id: args.data.id } }, context, info)
  )
  return prisma.deleteOffice({ id: officeObj.id })
}

export const updateOffice: ResolversRequired['Mutation']['updateOffice'] = async (_, args, context) => {
  const { data: { brokerageId, regionId, ...data } } = args

  const query = `{
    id
    connectedBrokerage: brokerage { id }
    connectedOwner: owner { id }
    connectedRegion: region { id }
  }`

  const officeObj = await getObjectOrError<GraphQLTypes.Office>(
    officesByRole(args, context, query)
  )

  type AliasedOffice = Omit<GraphQLTypes.Agent, 'brokerage' | 'owner' | 'region'> & {
    connectedBrokerage: GraphQLTypes.Brokerage
    connectedOwner: GraphQLTypes.Affiliate
    connectedRegion: GraphQLTypes.Region
  }

  const {
    connectedBrokerage,
    connectedOwner,
    connectedRegion
  } = officeObj as unknown as AliasedOffice

  let connectBrokerage, region
  if (brokerageId && (!connectedBrokerage || (connectedBrokerage && connectedBrokerage.id !== brokerageId))) {
    connectBrokerage = { connect: { id: brokerageId } }
  }
  if (!regionId && connectedRegion && connectedRegion.id && connectedOwner && connectedOwner.id) {
    const availableRegions = await prisma.affiliate({ id: connectedOwner.id }).regions()
    if (availableRegions.length > 0) {
      region = { connect: { id: availableRegions[0].id } }
    } else {
      throw new Error('There\'s no regions connected with Office\'s owner.') // TODO proper error handling
    }
  } else if (regionId && (!connectedRegion || (connectedRegion && connectedRegion.id !== regionId))) {
    region = { connect: { id: regionId } }
  }
  return prisma.updateOffice({
    data: {
      ...data,
      brokerage: connectBrokerage,
      photoDownloadPresets: convertToEnabledPhotoPresetUpdateManyInput(data.photoDownloadPresets),
      region
    },
    where: { id: officeObj.id }
  })
}
