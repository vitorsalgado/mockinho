import { ServerOptions as HttpsServerOptions } from 'https'
import { Logger } from '@mockinho/core'
import { RecordOptions } from '../rec/RecordOptions'

export interface Configurations {
  readonly useHttp: boolean
  readonly httpPort: number
  readonly httpHost: string
  readonly httpDynamicPort: boolean
  readonly useHttps: boolean
  readonly httpsPort: number
  readonly httpsHost: string
  readonly httpsOptions?: HttpsServerOptions
  readonly httpsDynamicPort: boolean

  readonly loggers: Array<Logger>
  readonly isVerbose: boolean

  readonly stubsDirectory: string
  readonly stubsExtension: string
  readonly isStubFilesEnabled: boolean

  readonly isRecordEnabled: boolean
  readonly recordOptions: RecordOptions

  readonly trace: boolean
}
