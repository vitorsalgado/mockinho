import { Request, Express } from 'express'
import { BodyType, Methods } from './http.js'

export interface SrvRequest
  extends Request<{ [key: string]: string }, any, BodyType, URLSearchParams> {
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
