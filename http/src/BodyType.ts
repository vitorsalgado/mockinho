import { Stream } from 'stream'
import { JsonType } from '@mockinho/core'

export type BodyType = string | Buffer | Stream | undefined | JsonType | unknown | null
