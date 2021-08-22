import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { RequestHandler } from 'express'
import { Logger } from '@mockinho/core'
import { Configuration } from '@mockinho/core'
import { PluginFactory } from '@mockinho/core'
import { RecordOptions } from '../rec/RecordOptions'
import { MockProviderFactory } from '../mockproviders/MockProvider'
import { DefaultConfiguration } from '../types'
import { FieldParser } from '../mockproviders/default/FieldParser'

export interface HttpConfiguration extends Configuration {
  readonly useHttp: boolean
  readonly httpPort: number
  readonly httpHost: string
  readonly httpOptions?: HttpServerOptions
  readonly httpDynamicPort: boolean
  readonly useHttps: boolean
  readonly httpsPort: number
  readonly httpsHost: string
  readonly httpsOptions?: HttpsServerOptions
  readonly httpsDynamicPort: boolean

  readonly timeout: number

  readonly loggers: Array<Logger>
  readonly isVerbose: boolean

  readonly mocksDirectory: string
  readonly mocksExtension: string
  readonly isMockFilesEnabled: boolean

  readonly isRecordEnabled: boolean
  readonly recordOptions?: RecordOptions

  readonly mockProviderFactories: Array<MockProviderFactory<DefaultConfiguration>>
  readonly mockFieldParsers: Array<FieldParser>
  readonly pluginFactories: Array<PluginFactory>

  // Express Configurations
  // --
  readonly formUrlEncodedOptions?: OptionsUrlencoded
  readonly multiPartOptions?: Multer.Options
  readonly isCorsEnabled: boolean
  readonly corsOptions?: CorsOptions
  readonly cookieSecrets?: string | Array<string>
  readonly cookieOptions?: CookieParseOptions
  readonly isProxyEnabled: boolean
  readonly proxyOptions: Options
  readonly preHandlerMiddlewares: Array<RequestHandler>
}
