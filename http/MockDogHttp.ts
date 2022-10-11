import { Express } from 'express'
import { notBlank } from '@mockdog/x'
import { StateRepository } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { MockApp } from '@mockdog/core'
import { HttpConfigurationBuilder } from './config/index.js'
import { HttpConfiguration } from './config/index.js'
import { Middleware } from './config/index.js'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './feat/hooks/index.js'
import { Hooks } from './feat/hooks/index.js'
import { HttpContext } from './HttpContext.js'
import { HttpMock, HttpMockRepository } from './mock.js'
import { Deps } from './mock_builder.js'
import { HttpServer, HttpServerInfo } from './srv.js'
import { defaultMockProviderFactory } from './loaders/default/defaultMockProviderFactory.js'
import { onProxyRequest } from './feat/hooks/builtin/onProxyRequest.js'
import { onProxyResponse } from './feat/hooks/builtin/onProxyResponse.js'
import { onRecord } from './feat/hooks/builtin/onRecord.js'

export class MockDogHttp extends MockApp<
  HttpMock,
  HttpServerInfo,
  Deps,
  HttpServer,
  HttpConfiguration,
  HttpContext
> {
  constructor(config: HttpConfigurationBuilder | HttpConfiguration) {
    const configurations = config instanceof HttpConfigurationBuilder ? config.build() : config
    const context = new HttpContext(configurations, new HttpMockRepository())
    const httpServer = new HttpServer(context)

    super(context, httpServer)
  }

  setup(): void {
    // FIXME: new logger
    // LoggerUtil.instance().subscribe(new PinoLogger(this._configuration.logLevel))

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

  protected deps(): Deps {
    return { stateRepository: new StateRepository() }
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
