import { Plugin } from './Plugin'

export interface PluginRegistration<OPTIONS = unknown, APP = unknown> {
  plugin: Plugin<OPTIONS, APP>
  opts?: OPTIONS
}
