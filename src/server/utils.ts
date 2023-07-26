import { getPublicUrl } from '#veewme/lib/storage'
import axios from 'axios'
import * as fs from 'fs'
import * as mimeTypes from 'mime-types'

const NODE_ENV = process.env.NODE_ENV

export const convertImageUrlToBase64 = async (path: string) => {
  if (!path) return ''
  try {
    const publicUrl = getPublicUrl(path)
    if (NODE_ENV === 'production' || (NODE_ENV === 'development' && publicUrl.startsWith('https'))) {
      const image = await axios.get(publicUrl, { responseType: 'arraybuffer' })
      const base64 = Buffer.from(image.data, 'binary').toString('base64')
      const contentType = image.headers['content-type']
      const mimeType = contentType.split(';')[0]
      return `data:${mimeType};base64,${base64}`
    }
    const localUrl = `./tmp${publicUrl}`
    if (fs.existsSync(localUrl)) {
      const localImage = fs.readFileSync(localUrl)
      const localBase64 = localImage.toString('base64')
      const localMimeType = mimeTypes.lookup(localUrl)
      return `data:${localMimeType};base64,${localBase64}`
    }
    return 'Something wrong with the image path'
  } catch (err) {
    throw new Error('Failed to download or encode image')
  }
}
