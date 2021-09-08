import { MultiResponseStrategy } from '../../HttpMultipleResponseFixtureBuilder'
import { HttpMethods } from '../../../types'

export interface MockFileResponse {
  status: number
  headers?: Record<string, string>
  proxyHeaders?: Record<string, string>
  proxyFrom?: string
  body?: unknown
  bodyFile?: string
  latency?: number

  [key: string]: unknown
}

export interface MockFile {
  id?: string
  priority?: number
  name?: string

  scenario?: {
    name: string
    requiredState?: string
    newState?: string
  }

  request: {
    scheme?: 'http' | 'https'
    method?: HttpMethods
    url?: string
    urlPath?: string
    urlPattern?: RegExp
    urlPathPattern?: RegExp
    urlExact?: string
    querystring?: Record<string, string | Record<string, string>>
    headers?: Record<string, string | Record<string, string>>
    body?: string | Record<string, string | Record<string, string>>
    bodyFile?: string
    files?: Record<string, Record<string, string>>

    [key: string]: unknown
  }

  response: MockFileResponse | Array<MockFileResponse>

  responseType?: MultiResponseStrategy

  returnErrorOnNoResponse?: boolean

  [key: string]: unknown
}
