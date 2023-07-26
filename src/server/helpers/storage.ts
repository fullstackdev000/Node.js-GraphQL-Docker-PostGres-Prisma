import { fixFloatAfterDigit } from '#veewme/lib/util'
import fs from 'fs'
import { Writable } from 'stream'

interface ProgressInput {
  progress: number
}

export const pipeWithProgressFn = <TProgressInput extends ProgressInput>(
  subscription: TProgressInput,
  trackUploadPhotoProgress: (subscription: TProgressInput) => void,
  contentLength: string = '0'
) => (source: fs.ReadStream, sink: Writable) => {
  const totalSize = parseInt(contentLength, 10)

  if (Number.isNaN(totalSize)) {
    throw new Error('File size should be a number.')
  }
  if (totalSize <= 0) {
    throw new Error('Wrong value of file size.')
  }

  let currentSize = 0
  const countData = (chunk: Buffer) => {
    currentSize += chunk.length
    subscription.progress = fixFloatAfterDigit((100 * currentSize) / totalSize, 1)
    trackUploadPhotoProgress(subscription)
  }

  let resolve: () => void
  let reject: (e: Error) => void

  return new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
    source
      .on('data', countData)
      .on('end', resolve)
      .on('error', reject)
      .pipe(sink)
      .on('error', reject)
  }).finally(() => {
    source.removeListener('data', countData)
    source.removeListener('end', resolve)
    source.removeListener('error', reject)
    sink.removeListener('error', reject)
  })
}
