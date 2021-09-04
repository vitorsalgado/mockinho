import { Mode } from '@mockinho/core'

export interface Argv {
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
  rootDir: string
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
  recordResponseHeaders?: Array<string>

  use?: Array<string>
}
