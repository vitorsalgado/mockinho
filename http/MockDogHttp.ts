import { Express } from 'express'
import { notBlank } from '@mockdog/core'
import { ScenarioRepository } from '@mockdog/core'
import { PinoLogger } from '@mockdog/core'
import { LoggerUtil } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { MockApp } from '@mockdog/core'
import { HttpConfigurationBuilder } from './config/index.js'
import { HttpConfiguration } from './config/index.js'
import { Middleware } from './config/index.js'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './hooks/index.js'
import { Hooks } from './hooks/index.js'
import { HttpContext } from './HttpContext.js'
import { HttpMockRepository } from './mock/index.js'
import { HttpMock } from './mock/index.js'
import { HttpServer } from './HttpServer.js'
import { defaultMockProviderFactory } from './mock/providers/default/defaultMockProviderFactory.js'
import { HttpServerInfo } from './HttpServerInfo.js'
import { onProxyRequest } from './hooks/builtin/onProxyRequest.js'
import { onProxyResponse } from './hooks/builtin/onProxyResponse.js'
import { onRecord } from './hooks/builtin/onRecord.js'

export class MockDogHttp extends MockApp<
  HttpMock,
  HttpServerInfo,
  HttpServer,
  HttpConfiguration,
  HttpContext
> {
  constructor(config: HttpConfigurationBuilder | HttpConfiguration) {
    const configurations = config instanceof HttpConfigurationBuilder ? config.build() : config
    const context = new HttpContext(
      configurations,
      new HttpMockRepository(),
      new ScenarioRepository(),
    )
    const httpServer = new HttpServer(context)

    super(context, httpServer)
  }

  setup(): void {
    LoggerUtil.instance().subscribe(new PinoLogger(this._configuration.logLevel))

    if (modeIsAtLeast(this._configuration, 'info')) {
      this.on('onRequestStart', onRequestReceived)
      this.on('onRequestNotMatched', onRequestNotMatched)
      this.on('onRequestMatched', onRequestMatched)
      this.on('onProxyRequest', onProxyRequest)
      this.on('onProxyResponse', onProxyResponse)
      this.on('onRecord', onRecord)
    }

    this._mockProviders.push(defaultMockProviderFactory(this._configuration))
  }

  async start(): Promise<HttpServerInfo> {
    return super.start().then(info => {
      this._context.emit('onStart', { info })
      return info
    })
  }

  on<E extends keyof Hooks>(hook: E, listener: (args: Hooks[E]) => void): this {
    notBlank(hook)
    this._context.on(hook, listener)
    return this
  }

  use(route: string | Middleware, middleware?: Middleware): void {
    this._mockServer.use(route, middleware)
  }

  close(): Promise<void> {
    return super.close().finally(() => this._context.emit('onClose'))
  }

  listener(): Express {
    return this._mockServer.server()
  }
}