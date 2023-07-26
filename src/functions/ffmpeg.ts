/* tslint:disable:no-console */

import { ChildProcessPromise, spawn, SpawnPromiseResult } from 'child-process-promise'

export function ffmpegSpawn (args: string[]): ChildProcessPromise<SpawnPromiseResult> {
  const cmd = require('@ffmpeg-installer/ffmpeg').path
  console.log(`Running ${[cmd].concat(args).join(' ')}..`)
  const ffmpeg = spawn(cmd, args)
  if (ffmpeg.childProcess.stderr) {
    ffmpeg.childProcess.stderr.on('data', data => {
      for (const line of data.toString().split('\n')) {
        console.log('[ffmpeg]', line)
      }
    })
  }

  return ffmpeg
}

export function joinFrames (opts: {
  fps: number
  outputPath: string
}) {
  const ffmpeg = ffmpegSpawn([
    '-f', 'image2pipe',
    '-r', opts.fps.toString(),
    '-i', '-',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    '-f', 'mp4',
    '-y',
    opts.outputPath
  ])
  if (ffmpeg.childProcess.stderr) {
    ffmpeg.childProcess.stderr.on('data', data => {
      for (const line of data.toString().split('\n')) {
        console.log('[ffmpeg]', line)
      }
    })
  }

  return ffmpeg
}
