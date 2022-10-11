import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { Configuration } from '@mockdog/core'
import { Mode } from '@mockdog/core'
import { Level } from '@mockdog/core'
import { RequestBodyParser } from '../mid/body_parser.js'
import { RecordOptions } from '../features/rec/index.js'
import { FieldParser } from '../mock/loaders/default/FieldParser.js'
import { MiddlewareRoute } from './MiddlewareRoute.js'
import { Argv } from './providers/index.js'
import { InitialOptions } from './providers/index.js'

export interface HttpConfiguration extends Configuration {
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
  mockFieldParsers: Array<FieldParser>
  requestBodyParsers: Array<RequestBodyParser>
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
  props: Map<string, unknown>
  argv?: Argv
  file?: InitialOptions
}
