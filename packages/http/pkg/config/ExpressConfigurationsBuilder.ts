import Path from 'path'
import { OptionsUrlencoded } from 'body-parser'
import Multer from 'multer'
import { CorsOptions } from 'cors'
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

    if (!this._stubsBodyContentDirectory) {
      this._stubsBodyContentDirectory = Path.join(
        this._root,
        `${ExpressConfigurationsBuilder.STUB_FIXTURES_DIR}/${ExpressConfigurationsBuilder.STUB_FIXTURES_BODY_FILES_DIR}`
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

    return {
      port: this._port,
      host: this._host,
      https: this._https,
      httpsOptions: this._httpsOptions,
      dynamicPort: this._dynamicPort,
      loggers: this._loggers,
      loadFileStubs: this._loadFileStubs,
      stubsDirectory: this._stubsDirectory,
      stubsBodyContentDirectory: this._stubsBodyContentDirectory,
      trace: this._trace,
      verbose: this._verbose,
      serverFactory: this._serverFactory,
      formUrlEncodedOptions: this._formBodyOptions,
      multiPartOptions: this._multiPartOptions,
      cors: this._cors,
      corsOptions: this._corsOptions
    }
  }
}
