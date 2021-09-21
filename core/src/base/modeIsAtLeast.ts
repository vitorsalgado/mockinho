import { BaseConfiguration } from './BaseConfiguration'
import { Mode } from './Mode'
import { Modes } from './Mode'

export function modeIsAtLeast(configuration: BaseConfiguration, mode: Mode): boolean {
  return Modes[configuration.mode] >= Modes[mode]
}
