import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { RequestHandler } from 'express'
import { Configurations } from './Configurations'

export interface ExpressConfigurations extends Configurations {
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
