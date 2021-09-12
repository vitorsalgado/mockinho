import Path from 'path'
import { ServerOptions as HttpsServerOptions } from 'https'
import { ServerOptions as HttpServerOptions } from 'http'
import { Options } from 'http-proxy-middleware'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import CookieParse from 'cookie-parser'
import { notBlank } from '@mockinho/core'
import { Level } from '@mockinho/core'
import { Mode } from '@mockinho/core'
import { RecordOptions } from '../mock/record'
import { RecordOptionsBuilder } from '../mock/record'
import { MockProviderFactory } from '../mock/providers/MockProvider'
import { FieldParser } from '../mock/providers/default/FieldParser'
import { Configuration } from './Configuration'
import { Defaults } from './Defaults'
import { PreMiddleware } from './PreMiddleware'

export class ConfigurationBuilder {
  private static MOCK_DEFAULT_FIXTURES_DIR = Defaults.fixturesDir

  private _useHttp: boolean = false
  private _httpPort: number = Defaults.port
  private _httpHost: string = Defaults.host
  private _httpOptions?: HttpServerOptions
  private _httpDynamicPort: boolean = true
  private _useHttps: boolean = false
  private _httpsPort: number = Defaults.port
  private _httpsHost: string = Defaults.host
  private _httpsOptions?: HttpsServerOptions
  private _httpsDynamicPort: boolean = true
  private _mode: Mode = Defaults.mode
  private _restartable = Defaults.restartCommand
  private _timeout: number = Defaults.timeout
  private _rootDir: string = Defaults.rootDir
  private _logLevel: Level = Defaults.logLevel
  private _loadMockFiles: boolean = false
  private _mocksDirectory: string = ''
  private _mocksExtension: string = Defaults.mocksExtension
  private _proxyAll: boolean = Defaults.proxy
  private _proxyOptions: Options = { secure: false, changeOrigin: true }
  private _recordEnabled: boolean = Defaults.record
  private _recordOptions?: RecordOptions
  private _mockProviderFactories: Array<MockProviderFactory<Configuration>> = []
  private _mockFieldParsers: Array<FieldParser> = []
  private _watch: boolean = Defaults.watch

  private _formBodyOptions?: OptionsUrlencoded
  private _multiPartOptions?: Multer.Options
  private _cors: boolean = false
  private _corsOptions?: CorsOptions
  private _cookieSecrets: Array<string> = []
  private _cookieOptions?: CookieParseOptions
  private _preHandlerMiddlewares: Array<Array<string | PreMiddleware>> = []

  // region General Configurations

  http(port: number, host: string = Defaults.host): this {
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

  httpOptions(options: HttpServerOptions): this {
    this._useHttp = true
    this._httpOptions = options
    return this
  }

  dynamicHttpPort(value: boolean = true): this {
    this._useHttp = true
    this._httpDynamicPort = value
    return this
  }

  disableHttp(value: boolean = false): this {
    this._useHttp = value
    return this
  }

  https(port: number, options: HttpsServerOptions, host: string = Defaults.host): this {
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

  disableHttps(value: boolean = false): this {
    this._useHttps = value
    return this
  }

  mode(mode: Mode): this {
    this._mode = mode
    return this
  }

  info(): this {
    this._mode = 'info'
    return this
  }

  verbose(): this {
    this._mode = 'verbose'
    return this
  }

  trace(): this {
    this._mode = 'trace'
    return this
  }

  silent(): this {
    this._mode = 'silent'
    return this
  }

  timeout(ms: number): this {
    this._timeout = ms
    return this
  }

  rootDir(rootDir: string): this {
    this._rootDir = rootDir
    return this
  }

  internalLogLevel(level: Level): this {
    this._logLevel = level
    return this
  }

  enableFileMocks(value: boolean = true): this {
    this._loadMockFiles = value
    return this
  }

  mockDirectory(path: string): this {
    this._mocksDirectory = Path.resolve(path)
    return this
  }

  mockFileExtension(ext: string): this {
    notBlank(ext)

    this._mocksExtension = ext
    return this
  }

  record(options?: RecordOptionsBuilder | RecordOptions | boolean): this {
    if (typeof options === 'boolean') {
      this._recordEnabled = options
      return this
    }

    this._recordEnabled = true
    this._recordOptions =
      options && options instanceof RecordOptionsBuilder ? options?.build() : options
    return this
  }

  watch(value: boolean = true): this {
    this._watch = value
    return this
  }

  addMockProviderFactory(...factory: Array<MockProviderFactory<Configuration>>): this {
    this._mockProviderFactories.push(...factory)
    return this
  }

  addMockFieldParser(...parser: Array<FieldParser>): this {
    this._mockFieldParsers.push(...parser)
    return this
  }

  // endregion

  // region Express

  formUrlEncodedOptions(options: OptionsUrlencoded): this {
    this._formBodyOptions = options
    return this
  }

  multiPartOptions(options: Multer.Options): this {
    this._multiPartOptions = options
    return this
  }

  enableCors(options?: CorsOptions | boolean): this {
    if (typeof options === 'boolean') {
      this._cors = options
      return this
    }

    this._cors = true
    this._corsOptions = options
    return this
  }

  cookieOptions(secrets: string | string[], options?: CookieParse.CookieParseOptions): this {
    if (typeof secrets === 'string') {
      this._cookieSecrets = [secrets]
    } else {
      this._cookieSecrets = secrets
    }

    this._cookieOptions = options
    return this
  }

  proxy(target: string | Options, options?: Options): this {
    this._proxyAll = true

    if (typeof target === 'string') {
      this._proxyOptions = { target, changeOrigin: true, secure: false, ...options }
    } else {
      this._proxyOptions = target
    }

    return this
  }

  disableProxy(value: boolean = true): this {
    this._proxyAll = !value
    return this
  }

  use(route: string | PreMiddleware, middleware?: PreMiddleware): this {
    if (typeof route === 'string' && middleware) {
      this._preHandlerMiddlewares.push(...[[route, middleware]])
    } else {
      this._preHandlerMiddlewares.push(...[[route]])
    }

    return this
  }

  // endregion

  build(): Configuration {
    if (!this._useHttp && !this._useHttps) {
      this._useHttp = true
    }

    if (!this._mocksDirectory) {
      this._mocksDirectory = Path.join(
        this._rootDir,
        `${ConfigurationBuilder.MOCK_DEFAULT_FIXTURES_DIR}`
      )
    }

    if (this._formBodyOptions) {
      if (!this._formBodyOptions.extended) {
        this._formBodyOptions.extended = false
      }
    } else {
      this._formBodyOptions = { extended: false }
    }

    if (!this._multiPartOptions) {
      this._multiPartOptions = { storage: Multer.memoryStorage() }
    }

    if (this._recordEnabled) {
      if (!this._recordOptions) {
        this._recordOptions = {
          destination: this._mocksDirectory,
          captureRequestHeaders: Defaults.recordOptions.captureRequestHeaders,
          captureResponseHeaders: Defaults.recordOptions.captureResponseHeaders
        }
      } else {
        this._recordOptions.destination =
          typeof this._recordOptions.destination === 'undefined' ||
          this._recordOptions.destination === null ||
          this._recordOptions.destination === ''
            ? this._mocksDirectory
            : this._recordOptions.destination

        this._recordOptions.captureRequestHeaders =
          this._recordOptions.captureRequestHeaders ?? Defaults.recordOptions.captureRequestHeaders

        this._recordOptions.captureResponseHeaders =
          this._recordOptions.captureResponseHeaders ??
          Defaults.recordOptions.captureResponseHeaders
      }
    }

    this._preHandlerMiddlewares.forEach(middleware => {
      if (middleware.length > 2) {
        throw new Error(
          'Each middleware item must contain 1 or 2 items: 1 for the middleware function or 2, the route and the middleware function.'
        )
      }

      if (middleware.length === 1) {
        if (typeof middleware[0] !== 'function') {
          throw new Error(
            'When middleware item contains 1 entry, it must be a middleware function.'
          )
        }
      }

      if (middleware.length === 2) {
        if (typeof middleware[0] !== 'string') {
          throw new Error(
            'First element of middleware entry must be the route and the second the middleware function.'
          )
        }

        if (typeof middleware[1] !== 'function') {
          throw new Error('Second element of middleware configuration entry must be a function.')
        }
      }
    })

    return new Configuration(
      this._mode,
      this._logLevel,
      this._useHttp,
      this._httpPort,
      this._httpHost,
      this._httpOptions,
      this._httpDynamicPort,
      this._useHttps,
      this._httpsPort,
      this._httpsHost,
      this._httpsOptions,
      this._httpsDynamicPort,
      this._restartable,
      this._timeout,
      this._rootDir,
      this._mocksDirectory,
      this._mocksExtension,
      this._loadMockFiles,
      this._recordEnabled,
      this._recordOptions,
      this._mockProviderFactories,
      this._mockFieldParsers,
      this._watch,
      this._formBodyOptions,
      this._multiPartOptions,
      this._cors,
      this._corsOptions,
      this._cookieSecrets,
      this._cookieOptions,
      this._proxyAll,
      this._proxyOptions,
      this._preHandlerMiddlewares
    )
  }
}
