import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { Logger } from '@mockinho/core'
import { MockPreInit } from '@mockinho/core'
import { RecordOptions } from '../rec/RecordOptions'
import { MockProviderFactory } from '../stubproviders/MockProviderFactory'
import { DefaultConfigurations } from '../types'
import { FieldParser } from '../stubproviders/default/FieldParser'
import { HttpContext } from '../HttpContext'
import { HttpRequest } from '../HttpRequest'
import { HttpResponseDefinition } from '../stub'
import { HttpResponseDefinitionBuilder } from '../stub'
import { HttpStub } from '../stub'

export interface Configurations {
  readonly useHttp: boolean
  readonly httpPort: number
  readonly httpHost: string
  readonly httpOptions?: HttpServerOptions
  readonly httpDynamicPort: boolean
  readonly useHttps: boolean
  readonly httpsPort: number
  readonly httpsHost: string
  readonly httpsOptions?: HttpsServerOptions
  readonly httpsDynamicPort: boolean

  readonly timeout: number

  readonly loggers: Array<Logger>
  readonly isVerbose: boolean

  readonly stubsDirectory: string
  readonly stubsExtension: string
  readonly isStubFilesEnabled: boolean

  readonly isRecordEnabled: boolean
  readonly recordOptions: RecordOptions

  readonly trace: boolean

  readonly mockProviderFactories: Array<MockProviderFactory<DefaultConfigurations>>
  readonly mockFieldParsers: Array<FieldParser>
  readonly mockPreInitializers: Array<
    MockPreInit<
      HttpContext,
      HttpRequest,
      HttpResponseDefinition,
      HttpResponseDefinitionBuilder,
      HttpStub
    >
  >
}
