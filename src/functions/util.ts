import * as fs from 'fs'
import mkdirp from 'mkdirp'
import fetch from 'node-fetch'
import { promisify } from 'util'

function getPath (url: string) {
  return url.replace(/^([a-z0-9]+:\/\/)(.*)$/i, (match, protocol, path) => {
    return path
  })
}

function getParent (url: string) {
  return url.substring(0, url.lastIndexOf('/'))
}

export function readFile (url: string) {
  if (url.startsWith('gs://')) {
    throw new Error('Not implemented yet.')
    // return s3.getObject(s3urls.fromUrl(url)).promise().then(data => data.Body)
  } else if (url.startsWith('file://')) {
    return promisify(fs.readFile)(getPath(url))
  } else if (url.startsWith('http://') || url.startsWith('https://')) {
    return fetch(url).then(response => response.buffer())
  } else {
    throw new Error(`Unknown format: ${url}`)
  }
}

export function writeBuffer (url: string, buffer: Buffer, contentType: string) {
  if (url.startsWith('gs://')) {
    throw new Error('Not implemented yet.')
    // return s3.upload(Object.assign({}, s3urls.fromUrl(url), {
    //   ACL: 'public-read',
    //   Body: buffer,
    //   ContentType: contentType
    // })).promise().then(result => {
    //   return s3urls.toUrl(result.Bucket, result.Key)['bucket-in-path']
    // })
  } else if (url.startsWith('file://')) {
    const path = getPath(url)
    return promisify(mkdirp)(getParent(path)).then(() => {
      return promisify(fs.writeFile)(path, buffer)
    }).then(() => url)
  } else {
    throw new Error(`Unknown format: ${url}`)
  }
}
