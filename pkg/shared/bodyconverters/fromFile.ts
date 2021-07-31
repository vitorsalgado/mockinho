import Fs from 'fs'
import Path from 'path'
import { Readable } from 'stream'

export const fromFile = (path: string): Readable => {
  if (!Fs.existsSync(path)) {
    throw new TypeError(`File ${path} not found!`)
  }

  return Fs.createReadStream(Path.resolve(path), 'utf8')
}
