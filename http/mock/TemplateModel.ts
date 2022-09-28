import { JsonType } from '@mockdog/core'
import { Methods } from '../Methods.js'
import { BodyType } from '../BodyType.js'

export interface TemplateModel {
  readonly request: {
    id: string
    href: string
    url: string
    method: Methods
    headers: Record<string, string>
    query: Record<string, string | Array<string>>
    body: BodyType
    isMultipart: boolean
    start: number
    [key: string]: unknown
  }
  readonly env: Record<string, string | undefined>
  readonly model?: JsonType
}