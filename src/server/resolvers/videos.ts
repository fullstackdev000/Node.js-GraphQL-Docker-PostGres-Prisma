import { ResolversTypes } from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { RealEstate } from '#veewme/graphql/types'
import { getPublicUrl, saveFileToStorage, unlink } from '#veewme/lib/storage'
import { formatDate } from '#veewme/lib/util'
import { UserInputError } from 'apollo-server-express'
import { ResolversRequired } from '../graphqlServer'
import { pipeWithProgressFn } from '../helpers/storage'
import { publishUploadProgress, UploadProgressInput } from './uploadProgress'
import { buildRemotePathForRealEstate } from './utils'

const getFauxVideoPhotos = async (fauxVideo: ResolversTypes['Video']) => {
  const fragment = `{ photo { id } }`
  interface PhotoFragment {
    photo: Pick<PrismaTypes.Photo, 'id'>
  }
  // query intermediary model to get photos assigned to given video
  const assignedPhotos = await prisma
    .fauxVideoPhotoses({
      orderBy: 'sortOrder_ASC',
      where: { video: { id: fauxVideo.id } }
    })
    .$fragment<PhotoFragment[]>(fragment)

  // get correctly sorted photo ids and fetch Photo objects
  const ids = assignedPhotos.map(assignedPhoto => assignedPhoto.photo.id)
  const photosUnsorted = (await prisma.photos({ where: { id_in: ids } })) || []

  // use helper object to map IDs to photos and use that to get photos in the same order as IDs
  const photoIdToObject: { [key: number]: PrismaTypes.Photo } = {}
  for (const photo of photosUnsorted) {
    photoIdToObject[photo.id] = photo
  }
  return ids.map(id => photoIdToObject[id])
}

export const Video: ResolversRequired['Video'] = {
  date: async parent => {
    const createdAt = await prisma.video({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatDate(date)
  },
  file: parent => prisma.video({ id: parent.id }).file(),
  fileName: async parent => {
    const file = await prisma.video({ id: parent.id }).file()
    return file ? file.filename : ''
  },
  photos: parent => getFauxVideoPhotos(parent),
  posterFullUrl: async parent => {
    const poster = parent.thumbId ? await prisma.photo({ id: parent.thumbId }).fileId() : null
    return poster ? getPublicUrl(poster.path) : ''
  },
  realEstate: async parent => prisma.video({ id: parent.id }).realEstate(),
  thumbUrl: async parent => {
    const thumb = parent.thumbId ? await prisma.photo({ id: parent.thumbId }).thumbId() : null
    return thumb ? getPublicUrl(thumb.path) : ''
  },
  url: async parent => {
    const file = await prisma.video({ id: parent.id }).file()
    return file ? getPublicUrl(file.path) : parent.url || ''
  }
}

export const videos: ResolversRequired['Query']['videos'] = async (_, args, context) => {
  return context.prismaBinding.query.videos({ ...args })
}

export const video: ResolversRequired['Query']['video'] = async (_, args, context) => {
  return context.prismaBinding.query.video({ ...args })
}

/**
 * Return new sort order value by counting how many videos are currently assigning to a real estate.
 * @param realEstateId ID of a real estate.
 */
const _getNewSortingOrder = async (realEstateId: number) => {
  const currentVideos = await prisma.videos({
    where: { realEstate: { id: realEstateId } }
  })
  return currentVideos.length
}

const _validatePhotosBelongToRealEstate = async (realEstateId: number, photoIds: number[]) => {
  interface PhotoFragment {
    id: number
    realEstateId: Pick<RealEstate, 'id'>
  }

  const photoFragment = `
  fragment Photo on Photo {
    id
    realEstateId {
      id
    }
  }
  `

  const photoObjects = await prisma
    .photos({ where: { id_in: photoIds, realEstateId: { id: realEstateId } } })
    .$fragment<PhotoFragment[]>(photoFragment)
  const foundIds = photoObjects.map(photoObj => photoObj.id)
  if (!foundIds.length) {
    throw new UserInputError(`Photos ${photoIds} don't belong to the real estate ${realEstateId}.`)
  }
  const difference = photoIds.filter(photoId => !foundIds.includes(photoId))
  if (difference.length) {
    throw new UserInputError(`Photos ${difference} don't belong to the real estate ${realEstateId}.`)
  }
}

const _assignPhotosToFauxVideo = async (fauxVideo: PrismaTypes.Video, photoIds: number[]) => {
  // Create M2M relation objects to assign photos to video using a particular sort order.
  for (const [index, photoId] of photoIds.entries()) {
    await prisma.createFauxVideoPhotos({
      photo: { connect: { id: photoId } },
      sortOrder: index,
      video: { connect: { id: fauxVideo.id } }
    })
  }
}

export const createVideoHosted: ResolversRequired['Mutation']['createVideoHosted'] = async (_, args, context) => {
  const { file, photoIdentification, realEstateId, ...data } = args.data

  const remotePath = await buildRemotePathForRealEstate(realEstateId)

  if (data.thumbId) {
    await _validatePhotosBelongToRealEstate(realEstateId, [data.thumbId])
  }

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

  const realEstateOrder = await _getNewSortingOrder(realEstateId)

  const savedVideo = await prisma.createVideo({
    ...data,
    file: uploadedFile && { create: { ...uploadedFile } },
    realEstate: { connect: { id: realEstateId } },
    realEstateOrder,
    type: 'Hosted'
  })

  if (savedVideo && uploadedFile && subscription) {
    subscription.complete = true
    subscription.progress = 100
    await publishUploadProgress(subscription)
  }
  return savedVideo
}

export const createVideoEmbed: ResolversRequired['Mutation']['createVideoEmbed'] = async (_, args) => {
  const { realEstateId, ...data } = args.data
  const realEstateOrder = await _getNewSortingOrder(realEstateId)
  return prisma.createVideo({
    ...data,
    realEstate: { connect: { id: realEstateId } },
    realEstateOrder,
    type: 'Embed'
  })
}

export const createVideoUrl: ResolversRequired['Mutation']['createVideoUrl'] = async (_, args) => {
  const { realEstateId, ...data } = args.data
  const realEstateOrder = await _getNewSortingOrder(realEstateId)
  return prisma.createVideo({
    ...data,
    realEstate: { connect: { id: realEstateId } },
    realEstateOrder,
    type: 'URL'
  })
}

export const createVideoFaux: ResolversRequired['Mutation']['createVideoFaux'] = async (_, args) => {
  const { realEstateId, photos, ...data } = args.data

  if (!photos.length) {
    throw new UserInputError('The `photos` input cannot be empty.')
  }

  const photoIdsToValidate = photos.slice()
  if (data.thumbId) {
    photoIdsToValidate.push(data.thumbId)
  }
  await _validatePhotosBelongToRealEstate(realEstateId, photoIdsToValidate)

  const fauxVideo = await prisma.createVideo({
    ...data,
    realEstate: { connect: { id: realEstateId } },
    type: 'Faux'
  })

  await _assignPhotosToFauxVideo(fauxVideo, photos)
  return fauxVideo
}

export const updateVideoHosted: ResolversRequired['Mutation']['updateVideoHosted'] = async (_, args) => {
  const { data, where } = args

  const videoObj = await prisma.video({ id: where.id })
  if (videoObj && videoObj.type !== 'Hosted') {
    throw new UserInputError('Wrong video type - provided ID is not a hosted video.')
  }
  if (data.thumbId) {
    const realEstate = await prisma.video({ id: where.id }).realEstate()
    await _validatePhotosBelongToRealEstate(realEstate.id, [data.thumbId])
  }

  return prisma.updateVideo({
    data: { ...data },
    where: { id: where.id }
  })
}

export const updateVideoEmbed: ResolversRequired['Mutation']['updateVideoEmbed'] = async (_, args) => {
  const { data, where } = args

  if ('embeddedCode' in data && !data.embeddedCode) {
    throw new UserInputError('The `embeddedCode` input cannot be empty.')
  }

  const videoObj = await prisma.video({ id: where.id })
  if (videoObj && videoObj.type !== 'Embed') {
    throw new UserInputError('Wrong video type - provided ID is not an embed video.')
  }

  return prisma.updateVideo({
    data: { ...data },
    where: { id: where.id }
  })
}

export const updateVideoUrl: ResolversRequired['Mutation']['updateVideoUrl'] = async (_, args) => {
  const { data, where } = args

  if ('url' in data && !data.url) {
    throw new UserInputError('The `url` input cannot be empty.')
  }

  const videoObj = await prisma.video({ id: where.id })
  if (videoObj && videoObj.type !== 'URL') {
    throw new UserInputError('Wrong video type - provided ID is not an URL video.')
  }

  return prisma.updateVideo({
    data: { ...data },
    where: { id: where.id }
  })
}

export const updateVideoFaux: ResolversRequired['Mutation']['updateVideoFaux'] = async (_, args) => {
  const {
    data: { photos, ...data },
    where
  } = args

  const videoObj = await prisma.video({ id: where.id })
  if (videoObj && videoObj.type !== 'Faux') {
    throw new UserInputError('Wrong video type - provided ID is not a faux video.')
  }

  if (photos) {
    if (!photos.length) {
      throw new UserInputError('The `photos` input cannot be empty.')
    }
    const realEstate = await prisma.video({ id: where.id }).realEstate()
    const photoIdsToValidate = photos.slice()
    if (data.thumbId) {
      photoIdsToValidate.push(data.thumbId)
    }
    await _validatePhotosBelongToRealEstate(realEstate.id, photoIdsToValidate)
  } else if (data.thumbId) {
    // If photos are empty, but thumbId is being updated, check if it belongs to existing photos.
    const realEstate = await prisma.video({ id: where.id }).realEstate()
    await _validatePhotosBelongToRealEstate(realEstate.id, [data.thumbId])
  }

  const fauxVideo = await prisma.updateVideo({
    data: { ...data },
    where: { id: where.id }
  })

  if (photos) {
    // delete current assignments and create new ones based on provided input
    await prisma.deleteManyFauxVideoPhotoses({ video: { id: fauxVideo.id } })
    await _assignPhotosToFauxVideo(fauxVideo, photos)
  }
  return fauxVideo
}

export const reorderVideos: ResolversRequired['Mutation']['reorderVideos'] = async (_, args) => {
  const results: PrismaTypes.Video[] = []
  for (const [index, id] of args.ids.entries()) {
    const updatedVideo = await prisma.updateVideo({
      data: { realEstateOrder: index },
      where: { id }
    })
    results.push(updatedVideo)
  }
  return results
}

export const deleteVideo: ResolversRequired['Mutation']['deleteVideo'] = async (_, args) => {
  const videoObj = await prisma.video({ id: args.where.id })
  if (!videoObj) throw new UserInputError('Video does not exist')

  const fileObj = await prisma.video({ id: args.where.id }).file()
  if (fileObj) {
    unlink(fileObj.path)
  }

  return prisma.deleteVideo({ id: args.where.id })
}
