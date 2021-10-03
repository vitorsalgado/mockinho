import { Express } from 'express'
import { notBlank } from '@mockdog/core'
import { ScenarioInMemoryRepository } from '@mockdog/core'
import { PinoLogger } from '@mockdog/core'
import { LoggerUtil } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { MockApp } from '@mockdog/core'
import { HttpConfigurationBuilder } from './config'
import { HttpConfiguration } from './config'
import { Middleware } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './hooks'
import { Hooks } from './hooks'
import { HttpContext } from './HttpContext'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'
import { HttpServer } from './HttpServer'
import { defaultMockProviderFactory } from './mock/providers/default/defaultMockProviderFactory'
import { HttpServerInfo } from './HttpServerInfo'
import { onProxyRequest } from './hooks/builtin/onProxyRequest'
import { onProxyResponse } from './hooks/builtin/onProxyResponse'
import { onRecord } from './hooks/builtin/onRecord'

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
      new ScenarioInMemoryRepository()
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
