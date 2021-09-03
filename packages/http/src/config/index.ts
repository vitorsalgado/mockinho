import { ConfigBuilder } from './ConfigBuilder'

export * from './HttpConfiguration'
export * from './ConfigBuilder'
export * from './Config'

export const opts = (): ConfigBuilder => new ConfigBuilder()
