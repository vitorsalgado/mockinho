export interface Plugin<OPTIONS = unknown, APP = unknown> {
  (instance: APP, opts?: OPTIONS): Promise<void> | void
}

export interface PluginRegistration<OPTIONS = unknown, APP = unknown> {
  plugin: Plugin<OPTIONS, APP>
  opts?: OPTIONS
}
