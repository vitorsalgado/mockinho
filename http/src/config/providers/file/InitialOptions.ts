import { ServerOptions as HttpServerOptions } from 'http'
import { ServerOptions as HttpsServerOptions } from 'https'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { Options } from 'http-proxy-middleware'
import { Mode } from '@mockinho/core'
import { RecordOptions } from '../../../mock/record'

export type InitialOptions = Partial<{
  readonly mode?: Mode

  readonly http?: {
    readonly port: number
    readonly host?: string
    readonly options?: HttpServerOptions
  }

  readonly https?: {
    readonly port: number
    readonly host?: string
    readonly options?: HttpsServerOptions
  }

  readonly timeout?: number

  readonly mockDirectory?: string
  readonly mockFilesExtension?: string

  readonly record?: {
    enabled: boolean
    options?: RecordOptions
  }

  readonly proxy?: {
    readonly enabled: boolean
    readonly target?: string
    readonly options?: Options
  }

  readonly watch?: boolean

  readonly formUrlEncodedOptions?: OptionsUrlencoded
  readonly multiPartOptions?: Multer.Options
  readonly corsEnabled?: boolean
  readonly corsOptions?: CorsOptions
  readonly cookieSecrets?: string | Array<string>

  readonly middlewares?: Array<string>
}>
