import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { ExpressServerFactory } from '../ExpressServerFactory'
import { Configurations } from './Configurations'

export interface ExpressConfigurations extends Configurations<ExpressServerFactory> {
  readonly formUrlEncodedOptions?: OptionsUrlencoded
  readonly multiPartOptions?: Multer.Options
  readonly cors: boolean
  readonly corsOptions?: CorsOptions
}
