import { Level } from '../log'
import { Mode } from './Mode'

export interface Configuration {
  readonly logLevel: Level
  readonly mode: Mode

  modeIsAtLeast(mode: Mode): boolean
}
