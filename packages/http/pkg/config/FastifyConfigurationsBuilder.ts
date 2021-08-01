import { LoggerPino } from '@mockinho/core'
import { FastifyCorsOptions } from 'fastify-cors'
import { FormBodyPluginOptions } from 'fastify-formbody'
import { FastifyMultipartOptions } from 'fastify-multipart'
import Path from 'path'
import { FastifyHttpServerFactory } from '../FastifyHttpServerFactory'
import { ConfigurationsBuilder } from './ConfigurationsBuilder'
import { FastifyConfigurations } from './FastifyConfigurations'

export class FastifyConfigurationsBuilder extends ConfigurationsBuilder<
  FastifyHttpServerFactory,
  FastifyConfigurations
> {
  private _formBodyOptions?: FormBodyPluginOptions
  private _multiPartOptions?: FastifyMultipartOptions
  private _cors: boolean = false
  private _corsOptions?: FastifyCorsOptions

  formBodyOptions(options: FormBodyPluginOptions): this {
    this._formBodyOptions = options
    return this
  }

  multiPartOptions(options: FastifyMultipartOptions): this {
    this._multiPartOptions = options
    return this
  }

  cors(options?: FastifyCorsOptions): this {
    this._cors = true
    this._corsOptions = options
    return this
  }

  build(): FastifyConfigurations {
    if (!this._defaultLoggerDisabled) {
      if (!this._loggers.some(x => x.name() === 'console-pino-pretty-internal')) {
        this._loggers.push(new LoggerPino(this._defaultLoggerLevel))
      }
    }

    if (!this._serverFactory) {
      this._serverFactory = new FastifyHttpServerFactory()
    }

    if (!this._stubsDirectory) {
      this._stubsDirectory = Path.join(
        this._root,
        `${FastifyConfigurationsBuilder.STUB_FIXTURES_DIR}`
      )
    }

    if (!this._stubsBodyContentDirectory) {
      this._stubsBodyContentDirectory = Path.join(
        this._root,
        `${FastifyConfigurationsBuilder.STUB_FIXTURES_DIR}/${FastifyConfigurationsBuilder.STUB_FIXTURES_BODY_FILES_DIR}`
      )
    }

    return {
      port: this._port,
      host: this._host,
      dynamicPort: this._dynamicPort,
      loggers: this._loggers,
      loadFileStubs: this._loadFileStubs,
      stubsDirectory: this._stubsDirectory,
      stubsBodyContentDirectory: this._stubsBodyContentDirectory,
      trace: this._trace,
      verbose: this._verbose,
      serverFactory: this._serverFactory,
      formBodyOptions: this._formBodyOptions,
      multiPartOptions: this._multiPartOptions,
      cors: this._cors,
      corsOptions: this._corsOptions
    }
  }
}
