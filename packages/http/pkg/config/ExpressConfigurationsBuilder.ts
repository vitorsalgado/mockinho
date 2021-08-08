import Path from 'path'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
import { CookieParseOptions } from 'cookie-parser'
import CookieParse from 'cookie-parser'
import { Options } from 'http-proxy-middleware'
import { LoggerPino } from '@mockinho/core'
import { ExpressServerFactory } from '../ExpressServerFactory'
import { ConfigurationsBuilder } from './ConfigurationsBuilder'
import { ExpressConfigurations } from './ExpressConfigurations'

export class ExpressConfigurationsBuilder extends ConfigurationsBuilder<
  ExpressServerFactory,
  ExpressConfigurations
> {
  private _formBodyOptions?: OptionsUrlencoded
  private _multiPartOptions?: Multer.Options
  private _cors: boolean = false
  private _corsOptions?: CorsOptions
  private _cookieSecrets?: string | Array<string>
  private _cookieOptions?: CookieParseOptions

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

  build(): ExpressConfigurations {
    if (!this._defaultLoggerDisabled) {
      if (!this._loggers.some(x => x.name() === 'console-pino-pretty-internal')) {
        this._loggers.push(new LoggerPino(this._defaultLoggerLevel))
      }
    }

    if (!this._serverFactory) {
      this._serverFactory = new ExpressServerFactory()
    }

    if (!this._stubsDirectory) {
      this._stubsDirectory = Path.join(
        this._root,
        `${ExpressConfigurationsBuilder.STUB_FIXTURES_DIR}`
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

    if (this._https && !this._httpsOptions) {
      throw new ReferenceError('HTTPS options is required when HTTPS is enabled.')
    }

    if (this._recordEnabled) {
      if (!this._recordOptions || !this._recordOptions.destination) {
        if (!this._recordOptions) {
          this._recordOptions = {
            destination: this._stubsDirectory,
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
          this._recordOptions.destination = this._stubsDirectory
        }
      }
    }

    return {
      port: this._port,
      host: this._host,
      https: this._https,
      httpsOptions: this._httpsOptions,
      dynamicPort: this._dynamicPort,
      loggers: this._loggers,
      isStubFilesEnabled: this._loadFileStubs,
      stubsDirectory: this._stubsDirectory,
      stubsExtension: this._stubsExtension,
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
      recordOptions: this._recordOptions!
    }
  }
}
