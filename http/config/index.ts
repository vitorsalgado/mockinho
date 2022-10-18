import { HttpConfigurationBuilder } from './config_builder.js'

export * from './providers/index.js'
export * from './config.js'
export * from './config_builder.js'
export * from './mid.js'

export const opts = (): HttpConfigurationBuilder => new HttpConfigurationBuilder()
