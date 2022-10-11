import { RecordOptionsBuilder } from './options.js'

export * from './dispatcher.js'
export * from './options.js'

export function rec(): RecordOptionsBuilder {
  return new RecordOptionsBuilder()
}
