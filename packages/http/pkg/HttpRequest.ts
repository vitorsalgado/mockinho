import { Request, Express } from 'express'
import { FindStubResult } from '@mockinho/core'
import { BodyType, HttpMethods } from './types'
import { HttpContext } from './HttpContext'
import { HttpResponseDefinition } from './stub'
import { HttpResponseDefinitionBuilder } from './stub'

export interface HttpRequest extends Request {
  id: string
  href: string
  url: string
  method: HttpMethods
  headers: Record<string, string>
  query: Record<string, string | Array<string>>
  body: BodyType
  isMultipart: boolean
  files: Array<Express.Multer.File>
  start: number
  matched: boolean
  matchResult: FindStubResult<
    HttpContext,
    HttpRequest,
    HttpResponseDefinition,
    HttpResponseDefinitionBuilder
  >
}
