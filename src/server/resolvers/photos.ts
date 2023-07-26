import * as PrismaTypes from '#veewme/gen/prisma'
import { Maybe as PrismaMaybe, PhotoWhereInput, prisma } from '#veewme/gen/prisma'
import { File, Maybe as GraphqlMaybe, PhotosCustomWhereInput } from '#veewme/graphql/types'
import { zipFiles } from '#veewme/helpers/zipFile'
import { getPublicUrl, saveFileToStorage, unlink } from '#veewme/lib/storage'
import { formatDate } from '#veewme/lib/util'
import { UserInputError } from 'apollo-server-express'
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

export const Photo: ResolversRequired['Photo'] = {
  date: async parent => {
    const createdAt = await prisma.photo({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatDate(date)
  },
  file: async parent => prisma.photo({ id: parent.id }).fileId(),
  fileId: async parent => {
    const file = await prisma.photo({ id: parent.id }).fileId()
    return file ? file.id : null
  },
  fileName: async parent => {
    const file = await prisma.photo({ id: parent.id }).fileId()
    return file ? file.filename : ''
  },
  fullUrl: async parent => {
    const file = await prisma.photo({ id: parent.id }).fileId()
    return file ? getPublicUrl(file.path) : ''
  },
  realEstate: async parent => prisma.photo({ id: parent.id }).realEstateId(),
  realEstateId: async parent => {
    const realEstate = await prisma.photo({ id: parent.id }).realEstateId()
    return realEstate.id
  },
  star: async parent => {
    const p = await prisma.photo({ id: parent.id })
    return !!p && !!p.featured
  },
  thumb: async parent => prisma.photo({ id: parent.id }).thumbId(),
  thumbId: async parent => {
    const thumb = await prisma.photo({ id: parent.id }).thumbId()
    return thumb ? thumb.id : null
  },
  thumbUrl: async parent => {
    const thumbFile = await prisma.photo({ id: parent.id }).thumbId()
    const fallbackFile = await prisma.photo({ id: parent.id }).fileId()
    return resolveGeneratedStorageFileUrl(thumbFile, fallbackFile)
  },
  webFile: async parent => prisma.photo({ id: parent.id }).webFileId(),
  webFileId: async parent => {
    const webFile = await prisma.photo({ id: parent.id }).webFileId()
    return webFile ? webFile.id : null
  },
  webUrl: async parent => {
    const webFile = await prisma.photo({ id: parent.id }).webFileId()
    const fallbackFile = await prisma.photo({ id: parent.id }).fileId()
    return resolveGeneratedStorageFileUrl(webFile, fallbackFile)
  }
}

export const photo: ResolversRequired['Query']['photo'] = async (_, args, context) => {
  return context.prismaBinding.query.photo({ ...args })
}
export const photos: ResolversRequired['Query']['photos'] = async (_, args, context) => {
  return context.prismaBinding.query.photos({
    ...args,
    where: convertToPhotoWhereInput(args.where)
  })
}

export const reorderPhotos: ResolversRequired['Mutation']['reorderPhotos'] = async (_, args) => {
  const results: PrismaTypes.Photo[] = []
  for (const [index, id] of args.ids.entries()) {
    const updatedPhoto = await prisma.updatePhoto({
      data: { realEstateOrder: index },
      where: { id }
    })
    results.push(updatedPhoto)
  }
  return results
}

const convertToPhotoWhereInput: (input?: GraphqlMaybe<PhotosCustomWhereInput>) => PrismaMaybe<PhotoWhereInput> = input => {
  if (!input) { return }
  const {
    AND,
    featured,
    featured_not,
    file,
    fileId,
    NOT,
    OR,
    realEstate,
    realEstateId,
    star,
    star_not,
    thumb,
    thumbId,
    webFile,
    webFileId,
    ...where
  } = input
  const convertToPhotoWhereInputRecursively
  : (recursionInput?: GraphqlMaybe<PhotosCustomWhereInput[]>) => PrismaMaybe<PhotoWhereInput[]> = recursionInput => {
    const recursion = recursionInput && recursionInput
      .map((recursionElement: GraphqlMaybe<PhotosCustomWhereInput>): PrismaMaybe<PhotoWhereInput> => convertToPhotoWhereInput(recursionElement))
      .filter((recursionElement: PrismaMaybe<PhotoWhereInput>): recursionElement is PhotoWhereInput => !!recursionElement)
    return recursion || undefined
  }
  return {
    ...where,
    AND: convertToPhotoWhereInputRecursively(AND),
    featured: featured !== undefined && featured !== null ? featured : star,
    featured_not: featured_not !== undefined && featured_not !== null ? featured_not : star_not,
    fileId: file
    ? {
      ...file,
      id: fileId || file.id
    }
    : fileId ? { id: fileId } : undefined,
    NOT: convertToPhotoWhereInputRecursively(NOT),
    OR: convertToPhotoWhereInputRecursively(OR),
    realEstateId: realEstate
    ? {
      ...realEstate,
      id: realEstateId || realEstate.id
    }
    : realEstateId ? { id: realEstateId } : undefined,
    thumbId: thumb
    ? {
      ...thumb,
      id: thumbId || thumb.id
    }
    : thumbId ? { id: thumbId } : undefined,
    webFileId: webFile
    ? {
      ...webFile,
      id: webFileId || webFile.id
    }
    : webFileId ? { id: webFileId } : undefined
  }
}

interface PhotosPrismaBindingQuery {
  fileId: Pick<File, 'filename' | 'path'>
}
export const zipPhotos: ResolversRequired['Mutation']['zipPhotos'] = async (obj, args, context, info) => {
  const realEstate = await context.prismaBinding.query.realEstate({ where: args.where }, `{
    id
    city
    photoIds { fileId { filename path } }
    state
    street
    zip
  }`)
  const { street, city, state, zip } = realEstate
  return zipFiles({
    archiveName: street && city && state && zip && `${street}${city}${state}${zip}`,
    files: realEstate && realEstate.photoIds && realEstate.photoIds.map((p: PhotosPrismaBindingQuery) => ({
      filename: p.fileId.filename,
      path: getPublicUrl(p.fileId.path)
    })) || [],
    realEstateId: realEstate.id
  })
}

export const uploadRealEstatePhoto: ResolversRequired['Mutation']['uploadRealEstatePhoto'] = async (_, args, context) => {
  const { file, photoIdentification, ...data } = args.data

  const remotePath = await buildRemotePathForRealEstate(data.realEstateId)

  const subscription: UploadProgressInput = {
    complete: false,
    photoIdentification,
    progress: 0,
    realEstateId: data.realEstateId
  }
  await publishUploadProgress(subscription)

  const pipe = pipeWithProgressFn<UploadProgressInput>(
    subscription,
    publishUploadProgress,
    context.request
    && context.request.headers
    && context.request.headers['content-length']
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

  // calculate the realEstateOrder value so that the new photo is at the end of estate's
  // photos
  const currentPhotos = await prisma.photos({
    where: { realEstateId: { id: data.realEstateId } }
  })
  const realEstateOrder = currentPhotos.length

  const savedPhoto = await context.prismaBinding.mutation.createPhoto({
    data: {
      ...data,
      fileId: { create: uploadedFile },
      realEstateId: { connect: { id: data.realEstateId } },
      realEstateOrder,
      thumbId: { create: thumbFile },
      webFileId: { create: compressedFile }
    }
  })
  if (savedPhoto) {
    subscription.complete = true
    subscription.progress = 100
    await publishUploadProgress(subscription)
  }
  return savedPhoto
}

export const deletePhoto: ResolversRequired['Mutation']['deletePhoto'] = async (_, args) => {
  const photoObj = await prisma.photo({ id: args.where.id })
  if (!photoObj) throw new UserInputError('Photo does not exist')

  const fileObj = await prisma.photo({ id: args.where.id }).fileId()
  if (fileObj) {
    unlink(fileObj.path)
    deleteCompressedFile(fileObj.path)
    deleteThumbFile(fileObj.path)
  }

  return prisma.deletePhoto({ id: args.where.id })
}

interface PhotoFragment {
  fileId: Pick<File, 'path'>
}
export const deleteManyPhotos: ResolversRequired['Mutation']['deleteManyPhotos'] = async (_, args) => {
  // get files to delete with photos
  const fragment = `
  fragment Photo on Photo {
    fileId {
      path
    }
  }
  `
  const photosWithPaths = await prisma
    .photos({ where: { id_in: args.ids } })
    .$fragment<PhotoFragment[]>(fragment)

  // delete files
  const filePaths = photosWithPaths.map(item => item.fileId.path)
  filePaths.forEach(filePath => {
    unlink(filePath)
    deleteCompressedFile(filePath)
    deleteThumbFile(filePath)
  })

  // delete photos
  const results = await prisma.deleteManyPhotos({ id_in: args.ids })
  return parseInt(results.count, 10)
}

export const updatePhoto: ResolversRequired['Mutation']['updatePhoto'] = async (_, args) => {
  const { data, where } = args
  const photoObj = prisma.updatePhoto({
    data: { featured: data.featured, hidden: data.hidden, title: data.title },
    where: { id: where.id }
  })
  return photoObj
}

export const updateManyPhotos: ResolversRequired['Mutation']['updateManyPhotos'] = async (_, args) => {
  const { ids, data } = args
  const results = await prisma.updateManyPhotos({ data, where: { id_in: ids } })
  return parseInt(results.count, 10)
}
