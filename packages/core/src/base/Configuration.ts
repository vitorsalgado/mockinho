import { Level } from '../log'

export interface Configuration {
  readonly logLevel: Level
  readonly trace: boolean
}
