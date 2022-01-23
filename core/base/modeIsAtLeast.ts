import { Mode } from './Mode.js'
import { Modes } from './Mode.js'

export function modeIsAtLeast(configuration: { mode: Mode }, mode: Mode): boolean {
  return Modes[configuration.mode] >= Modes[mode]
}
