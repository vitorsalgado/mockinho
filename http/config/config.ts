import { ServerOptions as HttpServerOptions } from 'http'
import { ServerOptions as HttpsServerOptions } from 'https'
import { OptionsUrlencoded } from 'body-parser'
import { CookieParseOptions } from 'cookie-parser'
import { CorsOptions } from 'cors'
import { Options } from 'http-proxy-middleware'
import Multer from 'multer'
import { Configuration, Level, Mode } from '@mockdog/core'
import { RequestBodyParser } from '../feat/bodyparsers/body_parser.js'
import { RecordOptions } from '../feat/rec/index.js'
import { FieldParser } from '../loaders/default/FieldParser.js'
import { MiddlewareRoute } from './mid.js'
import { Argv, InitialOptions } from './providers/index.js'

export const Defaults = {
  fixturesDir: '_fixtures',
  port: 0,
  host: 'localhost',
  mode: 'verbose' as Mode,
  timeout: 5 * 60 * 1000,
  rootDir: process.cwd(),
  logLevel: 'error' as Level,
  mocksExtension: 'mock',
  restartCommand: 'rs',
  watch: false,
  record: false,
  proxy: false,
  recordOptions: {
    captureRequestHeaders: ['accept', 'content-type'],
    captureResponseHeaders: [
      'content-type',
      'link',
      'content-length',
      'cache-control',
      'retry-after',
    ],
  },
}

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
  parameters: Map<string, unknown>
  argv?: Argv
  file?: InitialOptions
}
