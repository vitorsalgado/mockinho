import { Request, Express } from 'express'
import { BodyType, Methods } from './http.js'

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

  $internals: SrvRequestInternals
}
