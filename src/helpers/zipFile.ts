import { File } from '#veewme/graphql/types'
import { createWriteStream, getPublicUrl } from '#veewme/lib/storage'
import * as archiver from 'archiver'
import axios from 'axios'
import * as fpath from 'path'

interface ZipFilesInput {
  realEstateId: number
  archiveName: string
  files: Array<Pick<File, 'filename' | 'path'>>
}
export const zipFiles = async ({ realEstateId, archiveName, files }: ZipFilesInput): Promise<string> => {
  const prefix = 'Zips'
  let outputPath = fpath.join(prefix, `${realEstateId}`)
  outputPath = fpath.join(outputPath, `${archiveName && archiveName.replace(/\s/g, '') || Date.now().toString()}.zip`)
  const archive = archiver('zip', { zlib: { level: 9 } })
  const sink = createWriteStream(outputPath)
  archive.pipe(sink)
  await Promise.all(
    files.map(({ filename, path }) => (
      axios({
        method: 'GET',
        responseType: 'stream',
        url: path
      }).then(response => {
        archive.append(response.data, { name: filename })
      })
    ))
  ).catch(err => {
    // TODO proper Error handling
    console.log(err) // tslint:disable-line
  })
  return archive.finalize().then(() => getPublicUrl(outputPath))
}
