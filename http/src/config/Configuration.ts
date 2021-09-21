import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { BaseConfiguration } from '@mockdog/core'
import { Mode } from '@mockdog/core'
import { Level } from '@mockdog/core'
import { RecordOptions } from '../mock/record'
import { MockProviderFactory } from '../mock/providers/MockProvider'
import { FieldParser } from '../mock/providers/default/FieldParser'
import { Plugin } from '../Plugin'
import { MiddlewareRoute } from './MiddlewareRoute'
import { Argv } from './providers'
import { InitialOptions } from './providers'

export interface Configuration extends BaseConfiguration {
  mode: Mode
  logLevel: Level
  useHttp: boolean
  httpPort: number
  httpHost: string
  httpOptions: HttpServerOptions | undefined
  httpDynamicPort: boolean
  useHttps: boolean
  httpsPort: number
  httpsHost: string
  httpsOptions: HttpsServerOptions | undefined
  httpsDynamicPort: boolean
  restartable: string
  timeout: number
  rootDir: string
  mockDirectory: string
  mockFilesExtension: string
  mockFilesEnabled: boolean
  recordEnabled: boolean
  recordOptions: RecordOptions | undefined
  mockProviderFactories: Array<MockProviderFactory>
  mockFieldParsers: Array<FieldParser>
  watch: boolean
  formUrlEncodedOptions: OptionsUrlencoded
  multiPartOptions: Multer.Options
  corsEnabled: boolean
  corsOptions: CorsOptions | undefined
  cookieSecrets: Array<string>
  cookieOptions: CookieParseOptions | undefined
  proxyEnabled: boolean
  proxyOptions: Options
  middlewares: Array<MiddlewareRoute>
  plugins: Array<Plugin<unknown>>
  props: Map<string, unknown>
  argv?: Argv
  file?: InitialOptions
}
