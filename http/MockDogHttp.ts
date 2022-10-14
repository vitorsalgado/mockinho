import { Express } from 'express'
import { notBlank } from '@mockdog/x'
import { MockBuilder, Scope, StateRepository } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { MockApp } from '@mockdog/core'
import { HttpConfigurationBuilder } from './config/index.js'
import { HttpConfiguration } from './config/index.js'
import { Middleware } from './config/index.js'
import {
  HookListener,
  onRequestMatched,
  onRequestNotMatched,
  onRequestReceived,
} from './feat/hooks/index.js'
import { Hooks } from './feat/hooks/index.js'
import { HttpMock, HttpMockRepository } from './mock.js'
import { Deps } from './builder.js'
import { HttpServer, HttpServerInfo } from './srv.js'
import { defaultMockProviderFactory } from './loaders/default/defaultMockProviderFactory.js'
import { onProxyRequest } from './feat/hooks/builtin/onProxyRequest.js'
import { onProxyResponse } from './feat/hooks/builtin/onProxyResponse.js'
import { onRecord } from './feat/hooks/builtin/onRecord.js'

export class MockDogHttp extends MockApp<
  HttpMock,
  HttpServerInfo,
  Express,
  HttpServer,
  Deps,
  HttpConfiguration
> {
  private readonly _stateRepository = new StateRepository()
  private readonly _hooks = new HookListener()

  constructor(config: HttpConfigurationBuilder | HttpConfiguration) {
    super(
      config instanceof HttpConfigurationBuilder ? config.build() : config,
      new HttpMockRepository(),
    )

    this.setup()
  }

  get hooks() {
    return this._hooks
  }

  mock(builder: MockBuilder<HttpMock, Deps> | Array<MockBuilder<HttpMock, Deps>>): Scope<HttpMock> {
    const builders = Array.isArray(builder) ? builder : [builder]
    const added = builders
      .map(b => b.build(this.deps()))
      .map(mock => this._mockRepository.save(mock))
      .map(mock => mock.id)

    return new Scope(this._mockRepository, added)
  }

  start(): Promise<HttpServerInfo> {
    return super.start().then(info => {
      this._hooks.emit('onStart', { info })
      return info
    })
  }

  on<E extends keyof Hooks>(hook: E, listener: (args: Hooks[E]) => void): this {
    notBlank(hook)
    this._hooks.on(hook, listener)
    return this
  }

  use(route: string | Middleware, middleware?: Middleware): void {
    this._mockServer.use(route, middleware)
  }

  close(): Promise<void> {
    return super.close().finally(() => this._hooks.emit('onClose'))
  }

  listener(): Express {
    return this._mockServer.server()
  }

  protected applyMocksFromProviders(): Promise<void> {
    return Promise.all(this._mockProviders.map(provider => provider())).then(mocks =>
      mocks.flatMap(x => x).forEach(mock => this.mock(mock)),
    )
  }

  protected setup(): void {
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
    this._mockServer.setup()
  }

  protected buildServer(): HttpServer {
    return new HttpServer(this)
  }

  protected deps(): Deps {
    return { stateRepository: this._stateRepository }
  }
}
