import { Mode } from '@mockdog/core'

export type Argv = Partial<{
  noHttp?: boolean
  port?: number
  host?: string

  noHttps?: boolean
  httpsPort?: number
  httpsHost?: string
  httpsKey?: string
  httpsCert?: string
  httpsCiphers?: string
  httpsPassphrase?: string
  httpsPfx?: string
  timeout?: number
  cors?: boolean
  cookieSecrets?: Array<string>

  watch?: boolean

  mode?: Mode
  logLevel?: string

  config?: string
  rootDir?: string
  mockDir?: string
  mockExtension?: string

  noProxy?: boolean
  proxy?: string
  proxyTimeout?: number
  proxyHeaders?: Array<string>
  proxyAuth?: string
  proxyPrependPath?: boolean
  proxyXfwd?: boolean

  record?: boolean
  recordDir?: string
  recordRequestHeaders?: Array<string>
  noRecordRequestHeaders?: boolean
  recordResponseHeaders?: Array<string>
  noRecordResponseHeaders?: boolean

  plugin?: Array<string>

  [key: string]: unknown
}>
