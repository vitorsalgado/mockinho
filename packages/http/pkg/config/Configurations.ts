import { Logger } from '@mockinho/core'
import { HttpServerFactory } from '../HttpServer'

export interface Configurations<ServerFactory extends HttpServerFactory> {
  readonly port: number
  readonly host: string
  readonly dynamicPort: boolean

  readonly loggers: Array<Logger>
  readonly verbose: boolean

  readonly stubsDirectory: string
  readonly stubsBodyContentDirectory: string
  readonly loadFileStubs: boolean

  readonly trace: boolean

  readonly serverFactory: ServerFactory
}
