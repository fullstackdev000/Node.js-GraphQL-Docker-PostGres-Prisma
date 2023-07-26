import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import { Maybe as PrismaMaybe, MediaDocumentWhereInput, prisma } from '#veewme/gen/prisma'
import { getPublicUrl, saveFileToStorage, unlink } from '#veewme/lib/storage'
import { Context } from '#veewme/lib/types'
import { UserInputError } from 'apollo-server-express'
import { GraphQLResolveInfo } from 'graphql'
import { ResolversRequired } from '../graphqlServer'
import { pipeWithProgressFn } from '../helpers/storage'
import { publishUploadProgress, UploadProgressInput } from './uploadProgress'
import { buildRemotePathForRealEstate, getObjectOrError } from './utils'

export const MediaDocument: ResolversRequired['MediaDocument'] = {
  downloadUrl: async parent => {
    const file = await prisma.mediaDocument({ id: parent.id }).fileId()
    return getPublicUrl(file.path)
  },
  extension: async parent => {
    const file = await prisma.mediaDocument({ id: parent.id }).fileId()
    return file.extension
  },
  file: async parent => prisma.mediaDocument({ id: parent.id }).fileId(),
  fileId: async parent => {
    const file = await prisma.mediaDocument({ id: parent.id }).fileId()
    return file.id
  },
  label: async parent => {
    const doc = await prisma.mediaDocument({ id: parent.id })
    const file = await prisma.mediaDocument({ id: parent.id }).fileId()
    return (doc && doc.label) || file.filename
  },
  realEstate: async parent => prisma.mediaDocument({ id: parent.id }).realEstateId(),
  realEstateId: async parent => {
    const realEstatate = await prisma.mediaDocument({ id: parent.id }).realEstateId()
    return realEstatate.id
  },
  size: async parent => {
    const file = await prisma.mediaDocument({ id: parent.id }).fileId()
    return file.size
  }
}

const mediaDocumentsByRole = async (
  argsWhere: MediaDocumentWhereInput | PrismaMaybe<MediaDocumentWhereInput>,
  context: Context,
  info: GraphQLResolveInfo | string
): Promise<GraphqlTypes.MediaDocument[]> => {
  const where: MediaDocumentWhereInput = { ...argsWhere }
  if (context.role === 'AFFILIATE') {
    const query = {
      OR: [
        { agentPrimaryId: { affiliate: { id: context.accountId } } },
        { agentCoListingId: { affiliate: { id: context.accountId } } }
      ]
    }
    if (!where.realEstateId) {
      where.realEstateId = query
    } else {
      where.realEstateId = {
        AND: [where.realEstateId, query]
      }
    }
  }
  if (context.role === 'AGENT') {
    const agentId = context.accountId
    const query = {
      OR: [{ agentPrimaryId: { id: agentId } }, { agentCoListingId: { id: agentId } }]
    }
    if (!where.realEstateId) {
      where.realEstateId = query
    } else {
      where.realEstateId = {
        AND: [where.realEstateId, query]
      }
    }
  }
  return context.prismaBinding.query.mediaDocuments({ where }, info)
}

export const mediaDocument: ResolversRequired['Query']['mediaDocument'] = (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.MediaDocument>(mediaDocumentsByRole({ id: args.where.id }, context, info))
}

export const mediaDocuments: ResolversRequired['Query']['mediaDocuments'] = (_, args, context, info) => {
  return mediaDocumentsByRole(args.where, context, info)
}

export const uploadMediaDocument: ResolversRequired['Mutation']['uploadMediaDocument'] = async (_, args, context) => {
  const { file, photoIdentification, realEstateId, ...data } = args.data

  const remotePath = await buildRemotePathForRealEstate(realEstateId)

  const subscription: UploadProgressInput = {
    complete: false,
    photoIdentification,
    progress: 0,
    realEstateId
  }
  await publishUploadProgress(subscription)

  const pipe = pipeWithProgressFn<UploadProgressInput>(
    subscription,
    publishUploadProgress,
    context.request && context.request.headers && context.request.headers['content-length']
  )
  const uploadedFile = await saveFileToStorage({ fileUpload: file, pipeFn: pipe, remotePath })

  const savedMediaDocument = await prisma.createMediaDocument({
    ...data,
    fileId: uploadedFile && { create: { ...uploadedFile } },
    realEstateId: { connect: { id: realEstateId } }
  })

  if (savedMediaDocument && uploadedFile && subscription) {
    subscription.complete = true
    subscription.progress = 100
    await publishUploadProgress(subscription)
  }
  return savedMediaDocument
}

export const updateMediaDocument: ResolversRequired['Mutation']['updateMediaDocument'] = async (_, args, context, info) => {
  const mediaDocumentObj = await getObjectOrError<GraphqlTypes.MediaDocument>(
    mediaDocumentsByRole({ id: args.where.id }, context, info)
  )
  return prisma.updateMediaDocument({ data: args.data, where: { id: mediaDocumentObj.id } })
}

export const deleteMediaDocument: ResolversRequired['Mutation']['deleteMediaDocument'] = async (_, args, context, info) => {
  const mediaDocumentObj = (await mediaDocumentsByRole({ id: args.where.id }, context, info))[0]
  if (!mediaDocumentObj) throw new UserInputError('Media document does not exist')

  const fileObj = await prisma.mediaDocument({ id: args.where.id }).fileId()
  if (fileObj) {
    unlink(fileObj.path)
  }
  return prisma.deleteMediaDocument({ id: args.where.id })
}
