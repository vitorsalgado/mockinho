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
import { PluginFactory } from '@mockinho/core'
import { Level } from '@mockinho/core'
import { RecordOptions } from '../rec/RecordOptions'
import { RecordOptionsBuilder } from '../rec/RecordOptionsBuilder'
import { MockProviderFactory } from '../mockproviders/MockProvider'
import { FieldParser } from '../mockproviders/default/FieldParser'
import { HttpConfiguration } from './HttpConfiguration'
import { ConfigError } from './ConfigError'
import { PreMiddleware } from './PreMiddleware'

export class HttpConfigurationBuilder {
  private static MOCK_FIXTURES_DIR = '__fixtures__'

  private _useHttp: boolean = false
  private _httpPort: number = 0
  private _httpHost: string = '127.0.0.1'
  private _httpOptions?: HttpServerOptions
  private _httpDynamicPort: boolean = true
  private _useHttps: boolean = false
  private _httpsPort: number = 0
  private _httpsHost: string = '127.0.0.1'
  private _httpsOptions?: HttpsServerOptions
  private _httpsDynamicPort: boolean = true
  private _timeout: number = 5 * 60 * 1000
  private _root: string = process.cwd()
  private _logLevel: Level = 'error'
  private _trace: boolean = false
  private _verbose: boolean = false
  private _loadMockFiles: boolean = false
  private _mocksDirectory: string = ''
  private _mocksExtension: string = 'mock'
  private _proxyAll: boolean = false
  private _proxyOptions: Options = { secure: false, changeOrigin: true }
  private _recordEnabled: boolean = false
  private _recordOptions?: RecordOptions
  private _mockProviderFactories: Array<MockProviderFactory<HttpConfiguration>> = []
  private _mockFieldParsers: Array<FieldParser> = []
  private _pluginFactories: Array<PluginFactory> = []

  private _formBodyOptions?: OptionsUrlencoded
  private _multiPartOptions?: Multer.Options
  private _cors: boolean = false
  private _corsOptions?: CorsOptions
  private _cookieSecrets?: string | Array<string>
  private _cookieOptions?: CookieParseOptions
  private _preHandlerMiddlewares: Array<Array<string | PreMiddleware>> = []

  // region General Configurations

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

  timeout(ms: number): this {
    this._timeout = ms
    return this
  }

  rootDir(rootPath: string): this {
    this._root = rootPath
    return this
  }

  verbose(value: boolean = true): this {
    this._verbose = value
    return this
  }

  logLevel(level: Level): this {
    this._logLevel = level
    return this
  }

  loadMocks(value: boolean = true): this {
    this._loadMockFiles = value
    return this
  }

  mocksDirectory(path: string): this {
    this._mocksDirectory = Path.resolve(path)
    return this
  }

  mocksExtension(ext: string): this {
    notBlank(ext)

    this._mocksExtension = ext
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

  addMockProviderFactory(...factory: Array<MockProviderFactory<HttpConfiguration>>): this {
    this._mockProviderFactories.push(...factory)
    return this
  }

  addMockFieldParser(...parser: Array<FieldParser>): this {
    this._mockFieldParsers.push(...parser)
    return this
  }

  addPlugin(...plugins: Array<PluginFactory>): this {
    this._pluginFactories.push(...plugins)
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

  enableCors(options?: CorsOptions): this {
    this._cors = true
    this._corsOptions = options
    return this
  }

  cookieOptions(secrets: string | string[], options?: CookieParse.CookieParseOptions): this {
    this._cookieSecrets = secrets
    this._cookieOptions = options
    return this
  }

  enableProxy(target: string | Options): this {
    this._proxyAll = true

    if (typeof target === 'string') {
      this._proxyOptions = { target, changeOrigin: true, secure: false }
    } else {
      this._proxyOptions = target
    }

    return this
  }

  addPreMiddlewares(middlewares: Array<Array<string | PreMiddleware>>): this {
    this._preHandlerMiddlewares.push(...middlewares)
    return this
  }

  use(route: string | PreMiddleware, middleware?: PreMiddleware): this {
    if (typeof route === 'string' && middleware) {
      this.addPreMiddlewares([[route, middleware]])
    } else {
      this.addPreMiddlewares([[route]])
    }

    return this
  }

  // endregion

  build(): HttpConfiguration {
    if (!this._mocksDirectory) {
      this._mocksDirectory = Path.join(this._root, `${HttpConfigurationBuilder.MOCK_FIXTURES_DIR}`)
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

    if (this._useHttps && !this._httpsOptions) {
      throw new ReferenceError('HTTPS options is required when HTTPS is enabled.')
    }

    if (this._recordEnabled) {
      if (!this._recordOptions || !this._recordOptions.destination) {
        if (!this._recordOptions) {
          this._recordOptions = {
            destination: this._mocksDirectory,
            captureRequestHeaders: ['accept', 'content-type'],
            captureResponseHeaders: [
              'content-type',
              'link',
              'content-length',
              'cache-control',
              'retry-after',
              'date',
              'access-control-expose-headers',
              'connection'
            ],
            filters: []
          }
        } else {
          this._recordOptions.destination = this._mocksDirectory
        }
      }
    }

    this._preHandlerMiddlewares.forEach(x => {
      if (x.length > 2) {
        throw new ConfigError(
          'Each middleware item must contain 1 or 2 items: 1 for the middleware function or 2, the route and the middleware function.'
        )
      }

      if (x.length === 1) {
        if (typeof x[0] !== 'function') {
          throw new ConfigError(
            'When middleware item contains 1 entry, it must be a middleware function.'
          )
        }
      }

      if (x.length === 2) {
        if (typeof x[0] !== 'string') {
          throw new ConfigError(
            'First element of middleware entry must be the route and the second the middleware function.'
          )
        }

        if (typeof x[1] !== 'function') {
          throw new ConfigError(
            'Second element of middleware configuration entry must be a function.'
          )
        }
      }
    })

    return {
      useHttp: this._useHttp,
      httpPort: this._httpPort,
      httpHost: this._httpHost,
      httpOptions: this._httpOptions,
      httpDynamicPort: this._httpDynamicPort,
      useHttps: this._useHttps,
      httpsPort: this._httpsPort,
      httpsHost: this._httpsHost,
      httpsDynamicPort: this._httpsDynamicPort,
      httpsOptions: this._httpsOptions,
      timeout: this._timeout,
      isMockFilesEnabled: this._loadMockFiles,
      mocksDirectory: this._mocksDirectory,
      mocksExtension: this._mocksExtension,
      logLevel: this._logLevel,
      trace: this._trace,
      isVerbose: this._verbose,
      formUrlEncodedOptions: this._formBodyOptions,
      multiPartOptions: this._multiPartOptions,
      isCorsEnabled: this._cors,
      corsOptions: this._corsOptions,
      cookieSecrets: this._cookieSecrets,
      cookieOptions: this._cookieOptions,
      proxyOptions: this._proxyOptions,
      isProxyEnabled: this._proxyAll,
      isRecordEnabled: this._recordEnabled,
      recordOptions: this._recordOptions,
      mockFieldParsers: this._mockFieldParsers,
      mockProviderFactories: this._mockProviderFactories,
      preHandlerMiddlewares: this._preHandlerMiddlewares,
      pluginFactories: this._pluginFactories
    }
  }
}
