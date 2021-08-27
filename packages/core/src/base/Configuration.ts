import { Level } from '../log'
import { Mode } from './Mode'

export interface Configuration {
  readonly logLevel: Level
  readonly mode: Mode

  modeIs(mode: Mode): boolean
}
