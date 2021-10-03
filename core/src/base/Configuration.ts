import { Level } from '../log'
import { MockProviderFactory } from './MockProviderFactory'
import { Plugin } from './Plugin'
import { Mode } from './Mode'

export interface Configuration {
  logLevel: Level
  mode: Mode
  mockProviderFactories: Array<MockProviderFactory>
  plugins: Array<Plugin>
}
