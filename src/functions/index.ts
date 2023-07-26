/* tslint:disable:no-console */

import { Request, Response } from 'express'
import { readFile } from './util'
import { generateVideoChunk } from './videogen'

export const generateVideo = async (req: Request, res: Response) => {
  await generateVideoChunk({
    diaporamaData: JSON.parse((await readFile('file://dist/functions/web/diaporamaData.json')).toString()),
    dimensions: { height: 1080, width: 1920 },
    durationSeconds: 10,
    firstFrameIdx: 0,
    fps: 25,
    numberOfFrames: 20
  })
  res.write('Hi!\n')
  res.end()
}

exports.generateVideo = generateVideo
