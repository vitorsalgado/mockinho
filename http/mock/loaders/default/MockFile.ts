import { Methods } from '../../../http.js'

export interface MockFile extends Lax {
  id?: string
  priority?: number
  name?: string

  locale?: string | Array<string>

  scenario?: {
    name: string
    requiredState?: string
    newState?: string
  }

  request: {
    scheme?: 'http' | 'https'
    method?: Methods
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
    helpers?: string
  } & Lax

  response?: MockFileResponse

  sequence?: {
    responses: Array<MockFileResponse>
    restartAfterEnded?: boolean
    afterEnded?: MockFileResponse
  }

  random?: {
    responses: Array<MockFileResponse>
  }
}

export interface Lax {
  [key: string]: unknown
}

export interface MockFileResponse extends Lax {
  status: number
  headers?: Record<string, string>
  headerTemplates?: Record<string, string>
  proxyHeaders?: Record<string, string>
  proxyFrom?: string
  body?: unknown
  bodyFile?: string
  bodyTemplate?: string

  // FIXME: use field above. file://
  bodyTemplateFile?: string
  modelFile?: string
  helpers?: string

  // FIXME: delay
  delay?: number
}
