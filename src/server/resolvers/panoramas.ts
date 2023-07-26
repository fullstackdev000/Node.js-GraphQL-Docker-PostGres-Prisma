import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { File } from '#veewme/graphql/types'
import { getPublicUrl, saveFileToStorage, unlink } from '#veewme/lib/storage'
import { formatDate } from '#veewme/lib/util'
import { UserInputError } from 'apollo-server-express'
import { forwardTo } from 'graphql-binding'
import { ResolversRequired } from '../graphqlServer'
import {
  deleteCompressedFile,
  deleteThumbFile,
  getCompressedImageFilename,
  getThumbFilename,
  isCompressionEnabled,
  resolveGeneratedStorageFileUrl
} from '../helpers/compression'
import { pipeWithProgressFn } from '../helpers/storage'
import { publishUploadProgress, UploadProgressInput } from './uploadProgress'
import { buildRemotePathForRealEstate } from './utils'

export const Panorama: ResolversRequired['Panorama'] = {
  date: async parent => {
    const createdAt = await prisma.panorama({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatDate(date)
  },
  file: parent => prisma.panorama({ id: parent.id }).file(),
  fileName: async parent => {
    const file = await prisma.panorama({ id: parent.id }).file()
    return file ? file.filename : ''
  },
  fullUrl: async parent => {
    const file = await prisma.panorama({ id: parent.id }).file()
    return file ? getPublicUrl(file.path) : ''
  },
  realEstate: async parent => prisma.panorama({ id: parent.id }).realEstate(),
  thumb: async parent => prisma.panorama({ id: parent.id }).thumb(),
  thumbUrl: async parent => {
    const thumbFile = await prisma.panorama({ id: parent.id }).thumb()
    const fallbackFile = await prisma.panorama({ id: parent.id }).file()
    return resolveGeneratedStorageFileUrl(thumbFile, fallbackFile)
  },
  webFile: async parent => prisma.panorama({ id: parent.id }).webFile(),
  webUrl: async parent => {
    const webFile = await prisma.panorama({ id: parent.id }).webFile()
    const fallbackFile = await prisma.panorama({ id: parent.id }).file()
    return resolveGeneratedStorageFileUrl(webFile, fallbackFile)
  }
}

export const panorama: ResolversRequired['Query']['panorama'] = forwardTo('prismaBinding')

export const panoramas: ResolversRequired['Query']['panoramas'] = async (_, args, context) => {
  return context.prismaBinding.query.panoramas({
    orderBy: args.orderBy,
    where: args.where
  })
}

export const uploadRealEstatePanorama: ResolversRequired['Mutation']['uploadRealEstatePanorama'] = async (
  _,
  args,
  context
) => {
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

  let compressedFile
  let thumbFile
  if (isCompressionEnabled()) {
    // If compression is enabled, save the path of the compressed image that will be created using Google Cloud
    // function.
    compressedFile = {
      ...uploadedFile,
      path: getCompressedImageFilename(uploadedFile.path)
    }
    thumbFile = {
      ...uploadedFile,
      path: getThumbFilename(uploadedFile.path)
    }
  } else {
    // Otherwise save the original file as the compressed one.
    compressedFile = uploadedFile
    thumbFile = uploadedFile
  }

  // calculate the realEstateOrder value so that the new panorama is at the end of estate's
  // panoramas
  const currentPanoramas = await prisma.panoramas({
    where: { realEstate: { id: realEstateId } }
  })
  const realEstateOrder = currentPanoramas.length

  const savedPanorama = await prisma.createPanorama({
    ...data,
    file: { create: { ...uploadedFile } },
    realEstate: { connect: { id: realEstateId } },
    realEstateOrder,
    thumb: { create: { ...thumbFile } },
    webFile: { create: { ...compressedFile } }
  })

  if (savedPanorama) {
    subscription.complete = true
    subscription.progress = 100
    await publishUploadProgress(subscription)
  }
  return savedPanorama
}

export const updatePanorama: ResolversRequired['Mutation']['updatePanorama'] = async (_, args) => {
  const { data, where } = args
  const panoramaObj = prisma.updatePanorama({
    data: { ...data },
    where: { id: where.id }
  })
  return panoramaObj
}

export const updateManyPanoramas: ResolversRequired['Mutation']['updateManyPanoramas'] = async (_, args) => {
  const { ids, data } = args
  const results = await prisma.updateManyPanoramas({ data, where: { id_in: ids } })
  return parseInt(results.count, 10)
}

export const deletePanorama: ResolversRequired['Mutation']['deletePanorama'] = async (_, args) => {
  const panoramaObj = await prisma.panorama({ id: args.where.id })
  if (!panoramaObj) throw new UserInputError('Panorama does not exist')

  const fileObj = await prisma.panorama({ id: args.where.id }).file()
  if (fileObj) {
    unlink(fileObj.path)
    deleteCompressedFile(fileObj.path)
    deleteThumbFile(fileObj.path)
  }

  return prisma.deletePanorama({ id: args.where.id })
}

interface PanoramaFragment {
  file: Pick<File, 'path'>
}
export const deleteManyPanoramas: ResolversRequired['Mutation']['deleteManyPanoramas'] = async (_, args) => {
  // get files to delete with photos
  const fragment = `
  fragment Panorama on Panorama {
    file {
      path
    }
  }
  `
  const panoramasWithPaths = await prisma
    .panoramas({ where: { id_in: args.ids } })
    .$fragment<PanoramaFragment[]>(fragment)

  // delete files from storage
  const filePaths = panoramasWithPaths.map(item => item.file.path)
  filePaths.forEach(path => {
    unlink(path)
    deleteCompressedFile(path)
    deleteThumbFile(path)
  })

  // delete panoramas from the database
  const results = await prisma.deleteManyPanoramas({ id_in: args.ids })
  return parseInt(results.count, 10)
}

export const reorderPanoramas: ResolversRequired['Mutation']['reorderPanoramas'] = async (_, args) => {
  const results: PrismaTypes.Panorama[] = []
  for (const [index, id] of args.ids.entries()) {
    const updatedPanorama = await prisma.updatePanorama({
      data: { realEstateOrder: index },
      where: { id }
    })
    results.push(updatedPanorama)
  }
  return results
}
