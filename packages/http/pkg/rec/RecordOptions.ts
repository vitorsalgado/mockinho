import { RecordFilter } from './RecordFilter'

export interface RecordOptions {
  destination: string
  captureRequestHeaders: Array<string>
  captureResponseHeaders: Array<string>
  filters: Array<RecordFilter<any>>
}
