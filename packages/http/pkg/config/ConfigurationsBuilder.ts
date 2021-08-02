import * as Path from 'path'
import { ServerOptions as HttpsServerOptions } from 'https'
import { Level, Logger } from '@mockinho/core'
import { HttpServerFactory } from '../HttpServer'
import { Configurations } from './Configurations'

export abstract class ConfigurationsBuilder<
  ServerFactory extends HttpServerFactory,
  Config extends Configurations<ServerFactory>
> {
  protected static STUB_FIXTURES_DIR = '__fixtures__'
  protected static STUB_FIXTURES_BODY_FILES_DIR = '__content__'

  protected _port: number = 0
  protected _host: string = '127.0.0.1'
  protected _https: boolean = false
  protected _httpsOptions?: HttpsServerOptions
  protected _root: string = process.cwd()
  protected _dynamicPort: boolean = true
  protected _defaultLoggerDisabled: boolean = false
  protected _defaultLoggerLevel: Level = 'info'
  protected _loggers: Array<Logger> = []
  protected _trace: boolean = false
  protected _verbose: boolean = false
  protected _serverFactory!: ServerFactory
  protected _loadFileStubs: boolean = false
  protected _stubsDirectory: string = ''
  protected _stubsBodyContentDirectory: string = ''

  port(port: number): this {
    this._port = port
    this._dynamicPort = false
    return this
  }

  host(host: string): this {
    this._host = host
    return this
  }

  root(rootPath: string): this {
    this._root = rootPath
    return this
  }

  https(options: HttpsServerOptions): this {
    this._https = true
    this._httpsOptions = options
    return this
  }

  dynamicPort(value: boolean = true): this {
    this._dynamicPort = value
    return this
  }

  log(log: Logger): this {
    this._loggers.push(log)
    return this
  }

  verbose(value: boolean = true): this {
    this._verbose = value
    return this
  }

  disableDefaultLogger(value: boolean = true): this {
    this._defaultLoggerDisabled = value
    return this
  }

  defaultLoggerLevel(level: Level): this {
    this._defaultLoggerLevel = level
    return this
  }

  loadFileStubs(value: boolean = true): this {
    this._loadFileStubs = value
    return this
  }

  stubsDirectory(path: string, bodies?: string): this {
    this._stubsDirectory = Path.resolve(path)
    this._stubsBodyContentDirectory = bodies
      ? Path.resolve(bodies)
      : Path.join(path, `${ConfigurationsBuilder.STUB_FIXTURES_BODY_FILES_DIR}`)

    return this
  }

  trace(value: boolean = true): this {
    this._trace = value
    return this
  }

  serverFactory(factory: ServerFactory): this {
    this._serverFactory = factory
    return this
  }

  abstract build(): Config
}
