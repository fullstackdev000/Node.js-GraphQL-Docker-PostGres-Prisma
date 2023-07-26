import { FileCreateInput } from '#veewme/gen/prisma/index'
import { Bucket, Storage } from '@google-cloud/storage'
import fs from 'fs'
import mime from 'mime-types'
import fsPath from 'path'
import * as ps from 'promise-streams'
import { Writable } from 'stream'
import uuidv4 from 'uuid/v4'

let storage: Storage, bucket: Bucket

if (process.env.STORAGE_TYPE === 'gcloud') {
  storage = new Storage({
    keyFilename: 'build/gcloud-key.json',
    projectId: process.env.GCLOUD_PROJECT
  })
  bucket = storage.bucket(process.env.GCLOUD_BUCKET || '')
}

export function getFullPath (path: string): string {
  return process.env.STORAGE_PREFIX ? `${process.env.STORAGE_PREFIX}/${path}` : path
}

export const bucketFileExists = async (filename: string) => {
  if (!bucket) return false
  const fullPath = getFullPath(filename)
  const file = bucket.file(fullPath)
  try {
    return (await file.exists())[0]
  } catch (error) {
    return false
  }
}

// <folder>/<file Name> pattern will automatically create folder
export function writeFileToRemoteStorage (fullPath: string): Writable {
  if (bucket) {
    return bucket.file(fullPath).createWriteStream({
      metadata: {
        cacheControl: 'public, max-age=0'
      }
    })
  } else {
    throw new Error('Error while writing file to Google Storage. No bucket exists.')
  }
}

export function getPublicUrl (path: string): string {
  // TODO remove before launching the app (or at least condition not to run on the production after deploying)
  if (path.search(/^https?(?=\:\/\/)/) === 0) {
    return path
  }
  const fullPath = getFullPath(path)
  if (process.env.STORAGE_TYPE === 'local') {
    return `/storage/${fullPath}`
  } else if (process.env.STORAGE_TYPE === 'gcloud') {
    return `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${fullPath}`
  } else {
    throw new Error('Unknown storage type.')
  }
}

export function createWriteStream (path: string): Writable {
  const fullPath = getFullPath(path)
  if (process.env.STORAGE_TYPE === 'local') {
    const writePath = fsPath.join('tmp/storage', fullPath)
    fs.mkdirSync(fsPath.dirname(writePath), { recursive: true })
    return fs.createWriteStream(writePath)
  } else if (process.env.STORAGE_TYPE === 'gcloud') {
    return writeFileToRemoteStorage(fullPath)
  } else {
    throw new Error('Unknown storage type.')
  }
}

export type FileUpload = Promise<{
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => fs.ReadStream
}>

export type FileInput = Exclude<FileCreateInput, 'id'>

export interface FileStorageArgs {
  fileUpload: FileUpload
  pipeFn?: (source: fs.ReadStream, sink: Writable) => Promise<any>
  remotePath?: string
}
// remotePath: Directory on GCP, should be separated with forward-slash: folder1/folder2/folder3
export async function saveFileToStorage ({ fileUpload, pipeFn, remotePath }: FileStorageArgs): Promise<FileInput> {
  const { filename, mimetype, createReadStream } = await fileUpload

  // Get the directory and filename for the uploaded file
  const extension = mime.extension(mimetype) || 'bin'
  const newFilename = `${uuidv4()}.${extension}`
  const dir = remotePath ? remotePath + '/' : ''
  const path = `${dir}${newFilename}`

  // Save to storage
  const src = createReadStream()
  const sink = createWriteStream(path)
  const pipe = pipeFn || ps.pipe
  await pipe(src, sink)

  // Get the file size and return upload results
  let size = 0
  if (process.env.STORAGE_TYPE === 'local') {
    const readPath = sink instanceof fs.WriteStream ? sink.path : sink
    if (readPath instanceof Writable) {
      // TODO get file size from Stream
      console.log(readPath) // tslint:disable-line
    } else {
      size = fs.statSync(typeof readPath === 'string' ? getFullPath(readPath) : readPath).size
    }
    return { extension, filename, path, size }
  } else if (process.env.STORAGE_TYPE === 'gcloud') {
    // When using Google Cloud Storage, listen to the "finish" event and fetch the size
    // of the uploaded file from metadata.
    return new Promise((resolve, reject) => {
      sink.on('finish', async () => {
        await bucket.file(path).setMetadata({ contentType: mimetype })
        const [metadata] = await bucket.file(path).getMetadata()
        size = parseInt(metadata.size, 10)
        resolve({ extension, filename, path, size })
      })
      sink.on('error', err => {
        console.error('Error on uploading to Google Storage: ', err) // tslint:disable-line
        reject()
      })
    })
  }
  return { extension, filename, path, size }
}

export function unlink (path: string): void {
  if (!path) {
    return
  }

  let fullPath

  if (process.env.STORAGE_TYPE === 'local') {
    fullPath = `tmp/storage/${path}`
    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
      return fs.unlink(fullPath, (unlinkErr: Error | null) => {
        if (unlinkErr) { throw unlinkErr }
      })
    }
    return
  } else if (process.env.STORAGE_TYPE === 'gcloud') {
    fullPath = path
    deleteFromRemoteStorage(fullPath).catch()
  }
}

// fullPath includes [full_path]/[file_name.ext]
function deleteFromRemoteStorage (fullPath: string) {
  const file = bucket.file(fullPath)
  return file.delete()
}

export function removeAllFilesFromStorage (directory: string = 'tmp/storage/'): void {
  fs.readdir(directory, (err: Error | null, files: string[]) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(fsPath.join(directory, file), (unlinkErr: Error | null) => {
        if (err) throw err
      })
    }
  })
}
