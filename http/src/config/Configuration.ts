import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { BaseConfiguration } from '@mockdog/core'
import { Mode } from '@mockdog/core'
import { Level } from '@mockdog/core'
import { RecordOptions } from '../mock/record'
import { MockProviderFactory } from '../mock/providers/MockProvider'
import { FieldParser } from '../mock/providers/default/FieldParser'
import { Plugin } from '../Plugin'
import { MiddlewareRoute } from './MiddlewareRoute'
import { Argv } from './providers'
import { InitialOptions } from './providers'

export class Configuration extends BaseConfiguration {
  public constructor(
    public readonly mode: Mode,
    public readonly logLevel: Level,
    public readonly useHttp: boolean,
    public readonly httpPort: number,
    public readonly httpHost: string,
    public readonly httpOptions: HttpServerOptions | undefined,
    public readonly httpDynamicPort: boolean,
    public readonly useHttps: boolean,
    public readonly httpsPort: number,
    public readonly httpsHost: string,
    public readonly httpsOptions: HttpsServerOptions | undefined,
    public readonly httpsDynamicPort: boolean,
    public readonly restartable: string,
    public readonly timeout: number,
    public readonly rootDir: string,
    public readonly mockDirectory: string,
    public readonly mockFilesExtension: string,
    public readonly mockFilesEnabled: boolean,
    public readonly recordEnabled: boolean,
    public readonly recordOptions: RecordOptions | undefined,
    public readonly mockProviderFactories: Array<MockProviderFactory>,
    public readonly mockFieldParsers: Array<FieldParser>,
    public readonly watch: boolean,
    public readonly formUrlEncodedOptions: OptionsUrlencoded,
    public readonly multiPartOptions: Multer.Options,
    public readonly corsEnabled: boolean,
    public readonly corsOptions: CorsOptions | undefined,
    public readonly cookieSecrets: Array<string>,
    public readonly cookieOptions: CookieParseOptions | undefined,
    public readonly proxyEnabled: boolean,
    public readonly proxyOptions: Options,
    public readonly middlewares: Array<MiddlewareRoute>,
    public readonly plugins: Array<Plugin<unknown>>,
    public readonly props: Map<string, unknown>,
    public readonly argv?: Argv,
    public readonly file?: InitialOptions
  ) {
    super(logLevel, mode)
  }
}
