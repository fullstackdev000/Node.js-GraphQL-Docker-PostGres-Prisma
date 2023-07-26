/**
 * This module contains helper functions which are used with image compression and thumbnail generation.
 */

import * as path from 'path'

import * as PrismaTypes from '#veewme/gen/prisma'
import { bucketFileExists, getPublicUrl, unlink } from '#veewme/lib/storage'

const COMPRESSED_IMAGE_PREFIX = 'compressed_'
const THUMB_PREFIX = 'thumb_'

/**
 * Compose the path for a compressed file from provided file name.
 * NOTE: Pattern used to compose the compressed path must match with the pattern used in `generateThumbnails`
 * Google Cloud Function.
 */
export const getCompressedImageFilename = (filename: string) => {
  const dirname = path.dirname(filename)
  const extension = path.extname(filename)
  const basename = path.basename(filename, extension)
  const compressedFilename = `${COMPRESSED_IMAGE_PREFIX}${basename}${extension}`
  return path.join(dirname, compressedFilename)
}

/**
 * Compose the path for a thumbnail file from provided file name.
 * NOTE: Pattern used to compose the thumbnail path must match with the pattern used in `generateThumbnails`
 * Google Cloud Function.
 */
export const getThumbFilename = (filename: string) => {
  const dirname = path.dirname(filename)
  const extension = path.extname(filename)
  const basename = path.basename(filename, extension)
  const thumbFilename = `${THUMB_PREFIX}${basename}${extension}`
  return path.join(dirname, thumbFilename)
}

/**
 * Returns true if image compression should be used. Image compression is used only when Google Cloud media storage is
 * enabled.
 */
export const isCompressionEnabled = () => {
  return process.env.STORAGE_TYPE === 'gcloud'
}

export const deleteCompressedFile = (filename: string) => {
  const compressedPath = getCompressedImageFilename(filename)
  unlink(compressedPath)
}

export const deleteThumbFile = (filename: string) => {
  const thumbPath = getThumbFilename(filename)
  unlink(thumbPath)
}

/**
 * Resolve URL for a file field that is generated using Google Cloud Functions such as compressed images and thumbnails.
 * It checks if the file already exists in the bucket; if so it returns the URL; if fallbackFile is provided, it returns
 * its URL; otherwise returns an empty string.
 */
export const resolveGeneratedStorageFileUrl = async (file: PrismaTypes.File, fallbackFile?: PrismaTypes.File) => {
  let defaultResponse = ''
  if (fallbackFile) {
    defaultResponse = getPublicUrl(fallbackFile.path)
  }

  if (file) {
    const publicUrl = getPublicUrl(file.path)
    if (isCompressionEnabled()) {
      // If compression is enabled, only return the URL if the file exists in bucket.
      const exists = await bucketFileExists(file.path)
      return exists ? publicUrl : defaultResponse
    }
    // If compression is not used, always return the URL (which in this case represents original file).
    return publicUrl
  }
  return defaultResponse
}
