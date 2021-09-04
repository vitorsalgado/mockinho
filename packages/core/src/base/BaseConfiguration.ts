import { Level } from '../log'
import { Mode } from './Mode'
import { Modes } from './Mode'

export abstract class BaseConfiguration {
  protected constructor(public readonly logLevel: Level, public readonly mode: Mode) {}

  modeIsAtLeast(mode: Mode): boolean {
    return Modes[this.mode] >= Modes[mode]
  }
}
