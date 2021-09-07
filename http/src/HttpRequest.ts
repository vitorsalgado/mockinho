import { Request, Express } from 'express'
import { BodyType, HttpMethods } from './types'

export interface HttpRequest extends Request {
  id: string
  href: string
  url: string
  method: HttpMethods
  headers: Record<string, string>
  query: Record<string, string | Array<string>>
  body: BodyType
  rawBody: Buffer
  isMultipart: boolean
  files: Array<Express.Multer.File>
  start: number
  proxied: boolean

  [key: string]: unknown
}
