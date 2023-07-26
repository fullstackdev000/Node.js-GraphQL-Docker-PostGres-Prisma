/**
 * This module provides a function that is used to compress media images. It is run on Google Cloud Functions and it's
 * triggered on `google.storage.object.finalize` storage event.
 * To deploy the function use the following command (from the project root):
 * gcloud functions deploy generateThumbnails --entry-point generateThumbnails --runtime nodejs10 --memory=1024MB --trigger-resource=newveewme --trigger-event=google.storage.object.finalize --source=src/functions/generateThumbnails --region=us-east1
 */

// tslint:disable

const path = require('path')
const os = require('os')
const { Storage } = require('@google-cloud/storage')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const sharp = require('sharp');

const storage = new Storage()

// NOTE: the pattern for naming compressed images must match with the patterns used in `getCompressedImageFilename`
// function in the server.
const COMPRESSED_PREFIX = 'compressed_'
const THUMBNAIL_PREFIX = 'thumb_'
const THUMBNAIL_WIDTH = 400
const SUPPORTED_EXTENSIONS = ['.jpeg', '.jpg', '.png']

const isImage = (name, contentType) => {
  if (contentType && contentType.startsWith('/image')) {
    return true
  }
  return SUPPORTED_EXTENSIONS.some(ext => name.endsWith(ext))
}

exports.generateThumbnails = async event => {
  console.log('Generating thumbnails: ', event.name)

  const fileBucket = event.bucket
  const filePath = event.name
  const contentType = event.contentType

  // Exit if this is triggered on a file that is not an image.
  if (!isImage(filePath, contentType)) {
    return console.log('This is not an image, exiting.')
  }

  // Exit if compressed file already exists.
  const filename = path.basename(filePath)
  const filenameWithoutExt = path.parse(filename).name
  if (filename.startsWith(COMPRESSED_PREFIX) || filename.startsWith(THUMBNAIL_PREFIX)) {
    return console.log('This file is already compressed, exiting.')
  }

  // Download the file to tmp path
  const bucket = storage.bucket(fileBucket)
  const file = bucket.file(filePath)
  const tempFilePath = path.join(os.tmpdir(), filename)
  await file.download({ destination: tempFilePath })

  // Run compression and save compressed version in tmp
  const destination = path.join(os.tmpdir(), filenameWithoutExt)
  const results = await imagemin([tempFilePath], {
    destination,
    plugins: [imageminMozjpeg(), imageminPngquant({ quality: [0.6, 0.8] })]
  })

  // Upload the compressed file to the bucket
  if (results) {
    const metadata = { contentType }
    const compressedFilename = `${COMPRESSED_PREFIX}${filename}`
    const compressedFilePath = path.join(path.dirname(filePath), compressedFilename)
    const destinationPath = results[0].destinationPath
    await bucket.upload(destinationPath, {
      destination: compressedFilePath,
      metadata: metadata
    })
    console.log('Created compression: ', destinationPath)
  }

  // Create thumbnail of the compressed image
  if (results) {
    const thumbFilename = `${THUMBNAIL_PREFIX}${filename}`
    const thumbOutputPath = path.join(os.tmpdir(), thumbFilename)
    const thumbUploadDest = path.join(path.dirname(filePath), thumbFilename)

    await sharp(results[0].destinationPath)
      .resize({ width: THUMBNAIL_WIDTH })
      .toFile(thumbOutputPath)

    // upload thumbnail to bucket
    console.log('Created thumbnail: ', thumbUploadDest)
    await bucket.upload(thumbOutputPath, {
      destination: thumbUploadDest,
      metadata: { contentType }
    })
  }
}
