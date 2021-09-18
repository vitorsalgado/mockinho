import { Stream } from 'stream'
import { JsonType } from '@mockdog/core'

export type BodyType = string | Buffer | Stream | undefined | JsonType | unknown | null
