export interface Plugin<OPTIONS = unknown, APP = unknown> {
  (instance: APP, options?: OPTIONS): Promise<void> | void
}

export interface PluginRegistration<OPTIONS = unknown, APP = unknown> {
  plugin: Plugin<OPTIONS, APP>
  options?: OPTIONS
}
