import { Request, Express } from 'express'
import { Methods } from './Methods'
import { BodyType } from '.'

export interface HttpRequest extends Request {
  id: string
  href: string
  url: string
  method: Methods
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
