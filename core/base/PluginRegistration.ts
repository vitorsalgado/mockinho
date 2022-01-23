import { Plugin } from './Plugin.js'

export interface PluginRegistration<OPTIONS = unknown, APP = unknown> {
  plugin: Plugin<OPTIONS, APP>
  opts?: OPTIONS
}
