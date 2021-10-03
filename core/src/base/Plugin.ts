export interface Plugin<OPTIONS = unknown, APP = unknown> {
  (instance: APP, opts?: OPTIONS): Promise<void> | void
}
