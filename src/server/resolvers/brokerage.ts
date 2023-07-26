import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { saveFileToStorage, unlink } from '#veewme/lib/storage'
import { Context } from '#veewme/lib/types'
import { GraphQLResolveInfo } from 'graphql'
import { ResolversRequired } from '../graphqlServer'
import { normalizeSearch } from '../search'
import {
  convertToEnabledPhotoPresetCreateManyInput,
  convertToEnabledPhotoPresetUpdateManyInput
} from './photoDownloadPresets'
import { buildRemotePathForBrokerage, getObjectOrError, updateSavedFile } from './utils'

export const getBrokerageSearchDocument = (data: GraphqlTypes.BrokerageCreateInput | GraphqlTypes.BrokerageUpdateInput) => {
  let values: string[] = []
  if (data) {
    values = [ data.companyName || '' ]
  }
  return normalizeSearch(values.join(' '))
}

export const Brokerage: ResolversRequired['Brokerage'] = {
  agents: parent => prisma.brokerage({ id: parent.id }).agents() || [],
  coverPhoto: parent => prisma.brokerage({ id: parent.id }).coverPhoto(),
  offices: parent => prisma.brokerage({ id: parent.id }).offices() || [],
  owner: parent => prisma.brokerage({ id: parent.id }).owner(),
  profilePicture: parent => prisma.brokerage({ id: parent.id }).profilePicture(),
  region: parent => prisma.brokerage({ id: parent.id }).region()
}

const getBrokeragesArgs = (
  args: GraphqlTypes.QueryBrokeragesArgs,
  context: Context
): any => {
  const { search, ...newArgs } = args
  const where: GraphqlTypes.BrokerageWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.owner = { id: context.accountId }
  }
  if (args.search) {
    const searchPhrase = normalizeSearch(args.search)
    where.searchDocument_contains = searchPhrase
  }
  newArgs.where = where
  return newArgs
}

const brokeragesByRole = async (
  args: GraphqlTypes.QueryBrokeragesArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<GraphqlTypes.Brokerage[]> => {
  const newArgs = getBrokeragesArgs(args, context)
  return context.prismaBinding.query.brokerages({ ...newArgs }, info)
}

export const brokerage: ResolversRequired['Query']['brokerage'] = async (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.Brokerage>(brokeragesByRole(args, context, info))
}

export const brokerages: ResolversRequired['Query']['brokerages'] = (_, args, context, info) => {
  return brokeragesByRole(args, context, info)
}

export const brokeragesConnection: ResolversRequired['Query']['brokeragesConnection'] = async (_, args, context) => {
  const newArgs = getBrokeragesArgs(args, context)
  const totalCount = await prisma
    .brokeragesConnection({ where: newArgs.where })
    .aggregate()
    .count()
  const objects = await brokeragesByRole(args, context)
  return { brokerages: objects, totalCount }
}

export const createBrokerage: ResolversRequired['Mutation']['createBrokerage'] = async (_, args, context) => {
  const { regionId, coverPhoto, profilePicture, ...data } = args.data
  let savedBrokerage = await prisma.createBrokerage({
    ...data,
    agents: { create: [] },
    defaultColorScheme: { create: data.defaultColorScheme },
    offices: { create: [] },
    owner: { connect: { id: data.owner || context.accountId } },
    photoDownloadPresets: convertToEnabledPhotoPresetCreateManyInput(data.photoDownloadPresets),
    region: { connect: { id: regionId } },
    searchDocument: getBrokerageSearchDocument(args.data)
  })

  if (profilePicture && profilePicture.file) {
    const remotePath = await buildRemotePathForBrokerage(savedBrokerage)
    const storedProfilePicture = await saveFileToStorage({ fileUpload: profilePicture.file, remotePath })
    savedBrokerage = await prisma.updateBrokerage({
      data: { profilePicture: { create: storedProfilePicture } },
      where: { id: savedBrokerage.id }
    })
  }
  if (coverPhoto && coverPhoto.file) {
    const remotePath = await buildRemotePathForBrokerage(savedBrokerage)
    const storedCoverPhoto = await saveFileToStorage({ fileUpload: coverPhoto.file, remotePath })
    savedBrokerage = await prisma.updateBrokerage({
      data: { coverPhoto: { create: storedCoverPhoto } },
      where: { id: savedBrokerage.id }
    })
  }
  return savedBrokerage
}

export const deleteBrokerage: ResolversRequired['Mutation']['deleteBrokerage'] = async (_, args, context, info) => {
  const brokerageObj = await getObjectOrError<GraphqlTypes.Brokerage>(brokeragesByRole(args, context, info))
  const profilePicFileObj = await prisma.brokerage({ id: args.where.id }).profilePicture()
  if (profilePicFileObj) {
    unlink(profilePicFileObj.path)
  }
  const coverPhotoFileObj = await prisma.brokerage({ id: args.where.id }).coverPhoto()
  if (coverPhotoFileObj) {
    unlink(coverPhotoFileObj.path)
  }
  return prisma.deleteBrokerage({ id: brokerageObj.id })
}

export const toggleBrokerageActivityStatus: ResolversRequired['Mutation']['toggleBrokerageActivityStatus'] = async (_, args, context, info) => {
  const brokerageObj = await getObjectOrError<GraphqlTypes.Brokerage>(
    brokeragesByRole({ where: { id: args.where } }, context, info)
  )
  return prisma.updateBrokerage({ data: args.data, where: { id: brokerageObj.id } })
}

function isToggleBrokerageActivityStatusInput (
  brokerageInput: GraphqlTypes.BrokerageUpdateInput | GraphqlTypes.ToggleActivityStatusInput
): brokerageInput is GraphqlTypes.ToggleActivityStatusInput {
  return !!brokerageInput.status
}

export const updateBrokerage: ResolversRequired['Mutation']['updateBrokerage'] = async (_, args, context, info) => {
  const { data: { regionId, ...data }, where } = args

  const query = `{
    id
    connectedCoverPhoto: coverPhoto { path }
    connectedProfilePicture: profilePicture { path }
  }`
  const brokerageObj = await getObjectOrError<PrismaTypes.Brokerage>(
    context.prismaBinding.query.brokerages({ where: { id: where } }, query)
  )
  type AliasedBrokerage = Omit<GraphqlTypes.Brokerage, | 'coverPhoto' | 'profilePicture'> & {
    connectedCoverPhoto: GraphqlTypes.File
    connectedProfilePicture: GraphqlTypes.File
  }
  const { connectedCoverPhoto, connectedProfilePicture } = (brokerageObj as unknown) as AliasedBrokerage

  const agentsConnectedWithBrokerage = await prisma.agents({ where: { brokerage: { id: brokerageObj.id } } })

  const remotePath = await buildRemotePathForBrokerage(brokerageObj)
  const profilePicture = await updateSavedFile(remotePath, connectedProfilePicture, data.profilePicture)
  const coverPhoto = await updateSavedFile(remotePath, connectedCoverPhoto, data.coverPhoto)

  const brokerageInput = isToggleBrokerageActivityStatusInput(args.data)
  ? { status: data.status }
  : {
    ...data,
    defaultColorScheme: { update: data.defaultColorScheme },
    photoDownloadPresets: convertToEnabledPhotoPresetUpdateManyInput(data.photoDownloadPresets),
    region: { connect: { id: regionId } }
  }
  return prisma.updateBrokerage({
    data: {
      ...brokerageInput,
      agents: agentsConnectedWithBrokerage && {
        updateMany: agentsConnectedWithBrokerage.map(({ id }) => ({
          data: { companyPay: data.companyPay },
          where: { id }
        }))
      },
      coverPhoto,
      profilePicture,
      searchDocument: getBrokerageSearchDocument(args.data)
    },
    where: { id: brokerageObj.id }
  })
}
