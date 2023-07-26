import { prisma } from '#veewme/gen/prisma'
import * as PrismaTypes from '#veewme/gen/prisma'
import { saveFileToStorage } from '#veewme/lib/storage'
import { ResolversRequired } from '../graphqlServer'
import { buildRemotePathForRealEstate } from './utils'

export const MediaInteractiveFile: ResolversRequired['MediaInteractiveFile'] = {
  file: parent => prisma.mediaInteractiveFile({ id: parent.id }).file()
}

export const MediaInteractive: ResolversRequired['MediaInteractive'] = {
  files: parent => prisma.mediaInteractive({ id: parent.id }).files(),
  realEstate: parent => {
    return prisma.mediaInteractive({ id: parent.id }).realEstate()
  }
}

export const mediaInteractives: ResolversRequired['Query']['mediaInteractives'] = (_, args) => {
  return prisma.mediaInteractives({
    orderBy: args.orderBy || undefined,
    where: { ...args.where }
  })
}

export const mediaInteractive: ResolversRequired['Query']['mediaInteractive'] = async (_, args) => {
  return prisma.mediaInteractive({ id: args.id })
}

export const createMediaInteractive: ResolversRequired['Mutation']['createMediaInteractive'] = async (_, args) => {
  const { realEstateId, files, ...data } = args.data
  const filesToCreate: PrismaTypes.MediaInteractiveFileCreateInput[] = []
  if (files && files.length) {
    const remotePath = await buildRemotePathForRealEstate(realEstateId)
    for (const { file, label } of files) {
      const uploadedFile = await saveFileToStorage({ fileUpload: file, remotePath })
      filesToCreate.push({ file: { create: { ...uploadedFile } }, label })
    }
  }
  return prisma.createMediaInteractive({
    ...data,
    files: { create: filesToCreate },
    realEstate: { connect: { id: realEstateId } }
  })
}

export const updateMediaInteractive: ResolversRequired['Mutation']['updateMediaInteractive'] = async (_, args) => {
  const { files, ...data } = args.data
  const mediaInteractiveId = args.where.id

  const realEstate = await prisma.mediaInteractive({ id: mediaInteractiveId }).realEstate()
  if (!realEstate) {
    throw new Error(`Real estate not found for media interactive: ${mediaInteractiveId}`)
  }

  const filesToCreate: PrismaTypes.MediaInteractiveFileCreateInput[] = []
  const filesToUpdate: PrismaTypes.MediaInteractiveFileUpdateWithWhereUniqueNestedInput[] = []
  if (files && files.length) {
    const remotePath = await buildRemotePathForRealEstate(realEstate.id)
    for (const { id, file, label } of files) {
      if (file) {
        const uploadedFile = await saveFileToStorage({ fileUpload: file, remotePath })
        filesToCreate.push({ file: { create: { ...uploadedFile } }, label })
      } else {
        filesToUpdate.push({ data: { label }, where: { id } })
      }
    }
  }

  const currentFilesIds = (await prisma.mediaInteractive({ id: mediaInteractiveId }).files()).map(fileObj => fileObj.id)
  const updateFilesIds = files ? files.map(f => f.id) : []

  const filesData: PrismaTypes.MediaInteractiveFileUpdateManyInput = {
    create: filesToCreate,
    deleteMany: currentFilesIds ? currentFilesIds.filter(id => !updateFilesIds.includes(id)).map(id => ({ id })) : [],
    update: filesToUpdate
  }
  return prisma.updateMediaInteractive({ data: { files: filesData, ...data }, where: args.where })
}

export const deleteMediaInteractive: ResolversRequired['Mutation']['deleteMediaInteractive'] = async (_, args) => {
  return prisma.deleteMediaInteractive({ id: args.where.id })
}
