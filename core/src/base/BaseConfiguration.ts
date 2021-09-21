import { Level } from '../log'
import { Mode } from './Mode'

export interface BaseConfiguration {
  logLevel: Level
  mode: Mode
}
