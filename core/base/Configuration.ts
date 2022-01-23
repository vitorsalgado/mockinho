import { Level } from '../log/index.js'
import { MockProviderFactory } from './MockProviderFactory.js'
import { Plugin } from './Plugin.js'
import { Mode } from './Mode.js'

export interface Configuration {
  logLevel: Level
  mode: Mode
  mockProviderFactories: Array<MockProviderFactory>
  plugins: Array<Plugin>
}
