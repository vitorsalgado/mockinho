import { Request, Express } from 'express'
import { BodyType, Methods } from './http.js'
import type { MockDogHttp } from './MockDogHttp.js'
import * as keys from './symbols.js'

export interface SrvRequestInternals {
  id: string
  href: string
  rawBody: Buffer | null
  isMultipart: boolean
  start: number
  proxy: boolean
  proxyTarget: string
}

export interface SrvRequest
  extends Request<{ [key: string]: string }, any, BodyType, URLSearchParams> {
  method: Methods
  files: Array<Express.Multer.File>
  locals: Record<string, any>

  // TODO: change to symbols
  [keys.kInternals]: SrvRequestInternals

  $internals: SrvRequestInternals
  $ctx: MockDogHttp
}
