import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Configurations } from './Configurations'

export interface ExpressConfigurations extends Configurations {
  readonly formUrlEncodedOptions?: OptionsUrlencoded
  readonly multiPartOptions?: Multer.Options
  readonly cors: boolean
  readonly corsOptions?: CorsOptions
  readonly cookieSecrets?: string | Array<string>
  readonly cookieOptions?: CookieParseOptions
}
