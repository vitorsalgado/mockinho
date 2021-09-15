import { MockaccinoHttp } from './MockaccinoHttp'
import { Configuration } from './config'

export interface Plugin<Options> {
  (instance: MockaccinoHttp, config: Configuration, opts?: Options): Promise<void> | void
}

export interface PluginRegistration<Options> {
  plugin: Plugin<Options>
  opts?: Options
}
