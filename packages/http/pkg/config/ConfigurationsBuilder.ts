import Path from 'path'
import { ServerOptions as HttpsServerOptions } from 'https'
import { Options } from 'http-proxy-middleware'
import { Level, Logger } from '@mockinho/core'
import { notBlank } from '@mockinho/core'
import { HttpServerFactory } from '../HttpServer'
import { ExpressServerFactory } from '../ExpressServerFactory'
import { RecordOptions } from '../rec/RecordOptions'
import { RecordOptionsBuilder } from '../rec/RecordOptionsBuilder'

export abstract class ConfigurationsBuilder<ServerFactory extends HttpServerFactory, Config> {
  protected static STUB_FIXTURES_DIR = '__fixtures__'

  protected _useHttp: boolean = false
  protected _httpPort: number = 0
  protected _httpHost: string = '127.0.0.1'
  protected _httpDynamicPort: boolean = true
  protected _useHttps: boolean = false
  protected _httpsPort: number = 0
  protected _httpsHost: string = '127.0.0.1'
  protected _httpsOptions?: HttpsServerOptions
  protected _httpsDynamicPort: boolean = true
  protected _root: string = process.cwd()
  protected _defaultLoggerDisabled: boolean = false
  protected _defaultLoggerLevel: Level = 'info'
  protected _loggers: Array<Logger> = []
  protected _trace: boolean = false
  protected _verbose: boolean = false
  protected _serverFactory!: ServerFactory
  protected _loadFileStubs: boolean = false
  protected _stubsDirectory: string = ''
  protected _stubsExtension: string = 'mock'
  protected _proxyAll: boolean = false
  protected _proxyOptions: Options = { secure: false, changeOrigin: true }
  protected _recordEnabled: boolean = false
  protected _recordOptions?: RecordOptions

  // region Builders

  http(port: number, host: string = '127.0.0.1'): this {
    return this.httpPort(port).httpHost(host).dynamicHttpPort(false)
  }

  httpPort(port: number): this {
    this._useHttp = true
    this._httpPort = port
    this._httpDynamicPort = false
    return this
  }

  httpHost(host: string): this {
    this._useHttp = true
    this._httpHost = host
    return this
  }

  dynamicHttpPort(value: boolean = true): this {
    this._useHttp = true
    this._httpDynamicPort = value
    return this
  }

  https(port: number, options: HttpsServerOptions, host: string = '127.0.0.1'): this {
    return this.httpsPort(port).httpsHost(host).httpsOptions(options).dynamicHttpsPort(false)
  }

  httpsPort(port: number): this {
    this._useHttps = true
    this._httpsPort = port
    this._httpsDynamicPort = false
    return this
  }

  httpsHost(host: string): this {
    this._useHttps = true
    this._httpsHost = host
    return this
  }

  httpsOptions(options: HttpsServerOptions): this {
    this._useHttps = true
    this._httpsOptions = options
    return this
  }

  dynamicHttpsPort(value: boolean = true): this {
    this._useHttps = true
    this._httpsDynamicPort = value
    return this
  }

  root(rootPath: string): this {
    this._root = rootPath
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

  stubsDirectory(path: string): this {
    this._stubsDirectory = Path.resolve(path)
    return this
  }

  stubsExtension(ext: string): this {
    notBlank(ext)

    this._stubsExtension = ext
    return this
  }

  record(options?: RecordOptionsBuilder): this {
    this._recordEnabled = true
    this._recordOptions = options?.build()
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

  // endregion

  abstract build(): Config

  provideServerFactory(): ServerFactory {
    if (!this._serverFactory) {
      return new ExpressServerFactory() as ServerFactory
    }

    return this._serverFactory
  }
}
