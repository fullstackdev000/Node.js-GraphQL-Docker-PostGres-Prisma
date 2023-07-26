/* tslint:disable:no-console */

import http from 'http'
import puppeteer, { Serializable } from 'puppeteer'
import * as R from 'ramda'
import { promisify } from 'util'
import { readFile } from './util'

interface DiaporamaWindow extends Window {
  diaporama: {
    currentTime: number
  }
  lastRendered: number
  init (diaporamaData: Serializable): void
}
declare var window: DiaporamaWindow

interface Dimensions {
  height: number
  width: number
}

interface Resource {
  name: string
  url: string
}

const httpHost = 'localhost'
const httpPort = 8089

export function launchHTTPServer (resources: Resource[]) {
  const server = http.createServer(async (request, response) => {
    if (request.url === '/index.html' || request.url === '/') {
      await readFile('file://dist/functions/web/index.html').then(data => {
        response.end(data)
      })
      return
    }

    const resource = R.find<Resource>(r => request.url === '/' + r.name)(resources)
    if (resource) {
      await readFile(resource.url).then(data => {
        response.writeHead(200, {
          'Content-Length': Buffer.byteLength(data),
          'Content-Type': 'image/jpeg'
        })
        response.end(data)
      })
    } else {
      response.statusCode = 404
      response.end()
    }
  })
  return promisify(server.listen.bind(server))(httpPort).then(() => server)
}

export async function launchBrowser (dimensions: Dimensions, diaporamaData: Serializable) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu'
    ],
    headless: true
  })
  const page = await browser.newPage()
  page.on('console', e => console.log('[chrome]', e.text))
  await page.setViewport(dimensions)
  console.log(`Opening diaporama in a browser..`)
  await page.goto(`http://${httpHost}:${httpPort}`)
  await page.addScriptTag({ path: 'dist/functions/web/index.js' })
  await page.evaluate(dd => { window.init(dd) }, diaporamaData)
  await page.waitForFunction(() => window.diaporama)
  return { browser, page }
}

export async function* generateFrames (opts: {
  diaporamaData: Serializable
  dimensions: Dimensions
  durationSeconds: number
  firstFrameIdx: number
  fps: number
  numberOfFrames?: number
  resources: Resource[]
}) {
  const allFramesCount = opts.fps * opts.durationSeconds
  const frameInterval = 1000 / opts.fps
  const lastFrameIdx = opts.numberOfFrames === undefined
    ? allFramesCount - 1
    : Math.min(opts.firstFrameIdx + opts.numberOfFrames - 1,
      allFramesCount - 1)

  console.log('Launching HTTP server..')
  const httpServer = await launchHTTPServer(opts.resources)

  console.log(`Launching Chrome..`)
  const { browser, page } = await launchBrowser(opts.dimensions, opts.diaporamaData)

  console.log('Getting screenshots..')
  for (let idx = opts.firstFrameIdx; idx <= lastFrameIdx; idx++) {
    const currentTime = idx * frameInterval
    await page.evaluate(ct => { window.diaporama.currentTime = ct }, currentTime)
    // console.log(`currentTime = ${window.diaporama.currentTime}`)
    await page.waitForFunction(ct => window.lastRendered === ct, {}, currentTime)
    console.log(`Taking screenshot ${idx} (${currentTime}ms)..`)
    const frame = await page.screenshot({
      quality: 90,
      type: 'jpeg'
    })
    yield { idx, frame }
  }

  console.log('Closing browser..')
  await browser.close()

  console.log('Closing HTTP server..')
  await promisify(httpServer.close.bind(httpServer))()
}
