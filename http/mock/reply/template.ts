import { JsonType } from '@mockdog/x'
import { BodyType, Methods } from '../../http.js'

export interface TmplRequest {
  id: string
  href: string
  url: string
  method: Methods
  headers: Record<string, string>
  query: URLSearchParams
  body: BodyType
  isMultipart: boolean
  start: number
}

export interface TemplateModel {
  readonly request: TmplRequest
  readonly model?: JsonType
}
