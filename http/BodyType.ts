import { Stream } from 'stream'
import { JsonType } from '@mockdog/x'

export type BodyType = string | Buffer | Stream | undefined | JsonType | unknown | null
