import { Level } from './log/index.js'
import { Plugin } from './plugin.js'
import { Mode } from './mode.js'
import { MockProviderFactory } from './provider.js'

export interface Configuration {
  logLevel: Level
  mode: Mode
  mockProviderFactories: Array<MockProviderFactory>
  plugins: Array<Plugin>
}
