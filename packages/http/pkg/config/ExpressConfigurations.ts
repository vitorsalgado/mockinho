import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { Configurations } from './Configurations'

export interface ExpressConfigurations extends Configurations {
  readonly formUrlEncodedOptions?: OptionsUrlencoded
  readonly multiPartOptions?: Multer.Options
  readonly cors: boolean
  readonly corsOptions?: CorsOptions
}
