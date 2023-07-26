/* tslint:disable:no-console */

import { Serializable } from 'puppeteer'
import * as tmp from 'tmp-promise'
import * as browser from './browser'
import * as ffmpeg from './ffmpeg'
import { writeBuffer } from './util'

export async function generateVideoChunk (opts: {
  dimensions: {
    height: number
    width: number
  }
  diaporamaData: Serializable
  durationSeconds: number
  firstFrameIdx: number
  fps: number
  numberOfFrames: number
}) {
  const saveFrames = false
  const tmpDir = await tmp.dir({ prefix: 'veewme-videogen-', unsafeCleanup: true })
  const tmpDirUrl = `file://${tmpDir.path}`

  const ffmpegJoinFrames = ffmpeg.joinFrames({
    fps: opts.fps,
    outputPath: `${tmpDir.path}/video.mp4`
  })
  const framesGenerator = browser.generateFrames({
    ...opts,
    resources: []
  })
  for await (const { idx, frame } of framesGenerator) {
    console.log(`Writing ${Buffer.byteLength(frame)} bytes..`)
    if (ffmpegJoinFrames.childProcess.stdin) {
      ffmpegJoinFrames.childProcess.stdin.write(frame)
    }
    // if (idx === posterImageFrame) {
    //   await writeBuffer(`${outputDir}/poster.jpg`, slide, 'image/jpeg')
    // }
    if (saveFrames) {
      const fileName = `frame_${String(idx).padStart(6, '0')}.jpg`
      const fileUrl = `${tmpDirUrl}/${fileName}`
      await writeBuffer(fileUrl, frame, 'image/jpeg').then(savedUrl => {
        console.log(`Saved screenshot ${idx} as ${savedUrl}`)
      })
    }
  }
  if (ffmpegJoinFrames.childProcess.stdin) {
    ffmpegJoinFrames.childProcess.stdin.end()
  }

  console.log('Waiting for ffmpeg to finish..')
  await ffmpegJoinFrames

  console.log(`Cleaning up ${tmpDir.path}..`)
  // await tmpDir.cleanup()
}
