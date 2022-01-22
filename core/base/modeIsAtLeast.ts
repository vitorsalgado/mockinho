import { Mode } from './Mode'
import { Modes } from './Mode'

export function modeIsAtLeast(configuration: { mode: Mode }, mode: Mode): boolean {
  return Modes[configuration.mode] >= Modes[mode]
}
