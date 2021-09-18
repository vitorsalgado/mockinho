import { MockDogHttp } from './MockDogHttp'
import { Configuration } from './config'

export interface Plugin<Options> {
  (instance: MockDogHttp, config: Configuration, opts?: Options): Promise<void> | void
}

export interface PluginRegistration<Options> {
  plugin: Plugin<Options>
  opts?: Options
}
