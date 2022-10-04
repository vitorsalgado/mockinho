import { Request, Express } from 'express'
import * as core from 'express-serve-static-core'
import { BodyType, Methods } from './http.js'

export interface HttpRequest
  extends Request<core.ParamsDictionary, any, BodyType, URLSearchParams> {
  id: string
  href: string
  url: string
  method: Methods
  headers: Record<string, string>
  rawBody: Buffer
  isMultipart: boolean
  files: Array<Express.Multer.File>
  start: number
  proxied: boolean

  [key: string]: unknown
}
