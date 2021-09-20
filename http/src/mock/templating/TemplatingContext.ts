import { JsonType } from '@mockdog/core'
import { Methods } from '../../Methods'
import { BodyType } from '../../BodyType'

export interface TemplatingContext {
  request: {
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
  env: Record<string, string | undefined>
  model?: JsonType
}
