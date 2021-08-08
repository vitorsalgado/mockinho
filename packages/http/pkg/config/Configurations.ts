import { ServerOptions as HttpsServerOptions } from 'https'
import { Logger } from '@mockinho/core'
import { RecordOptions } from '../rec/RecordOptions'

export interface Configurations {
  readonly port: number
  readonly host: string
  readonly https: boolean
  readonly httpsOptions?: HttpsServerOptions
  readonly dynamicPort: boolean

  readonly loggers: Array<Logger>
  readonly isVerbose: boolean

  readonly stubsDirectory: string
  readonly stubsExtension: string
  readonly isStubFilesEnabled: boolean

  readonly isRecordEnabled: boolean
  readonly recordOptions: RecordOptions

  readonly trace: boolean
}
