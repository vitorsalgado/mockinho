import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { Response } from 'express'
import { NextFunction } from 'express'
import { BaseConfiguration } from '@mockinho/core'
import { PluginFactory } from '@mockinho/core'
import { Mode } from '@mockinho/core'
import { Level } from '@mockinho/core'
import { RecordOptions } from '../rec/RecordOptions'
import { MockProviderFactory } from '../mock/providers/MockProvider'
import { DefaultConfiguration } from '../types'
import { FieldParser } from '../mock/providers/default/FieldParser'
import { HttpRequest } from '../HttpRequest'

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
    public readonly timeout: number,
    public readonly rootDir: string,
    public readonly mockDirectory: string,
    public readonly mockFilesExtension: string,
    public readonly mockFilesEnabled: boolean,
    public readonly recordEnabled: boolean,
    public readonly recordOptions: RecordOptions | undefined,
    public readonly mockProviderFactories: Array<MockProviderFactory<DefaultConfiguration>>,
    public readonly mockFieldParsers: Array<FieldParser>,
    public readonly pluginFactories: Array<PluginFactory>,
    public readonly watch: boolean,
    public readonly formUrlEncodedOptions: OptionsUrlencoded,
    public readonly multiPartOptions: Multer.Options,
    public readonly corsEnabled: boolean,
    public readonly corsOptions: CorsOptions | undefined,
    public readonly cookieSecrets: Array<string>,
    public readonly cookieOptions: CookieParseOptions | undefined,
    public readonly proxyEnabled: boolean,
    public readonly proxyOptions: Options,
    public readonly preHandlerMiddlewares: Array<
      Array<
        string | ((req: HttpRequest, res: Response, next: NextFunction) => void | Promise<void>)
      >
    >
  ) {
    super(logLevel, mode)
  }
}
