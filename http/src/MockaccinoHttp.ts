import { Express } from 'express'
import { notBlank, notEmpty, MockSource } from '@mockinho/core'
import { ScenarioRepository } from '@mockinho/core'
import { ScenarioInMemoryRepository } from '@mockinho/core'
import { PinoLogger } from '@mockinho/core'
import { LoggerUtil } from '@mockinho/core'
import { ConfigurationBuilder } from './config'
import { Configuration } from './config'
import { Middleware } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './hooks'
import { Hooks } from './hooks'
import { HttpContext } from './HttpContext'
import { HttpMockBuilder, Scope } from './mock'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'
import { MockProvider } from './mock/providers/MockProvider'
import { HttpServer } from './HttpServer'
import { defaultMockProviderFactory } from './mock/providers/default/defaultMockProviderFactory'
import { Info } from './Info'
import { Plugin } from './Plugin'
import { PluginRegistration } from './Plugin'
import { onProxyRequest } from './hooks/builtin/onProxyRequest'
import { onProxyResponse } from './hooks/builtin/onProxyResponse'
import { onRecord } from './hooks/builtin/onRecord'

export class MockaccinoHttp {
  // region Ctor

  private readonly _context: HttpContext
  private readonly _httpServer: HttpServer
  private readonly _configuration: Configuration
  private readonly _mockRepository: HttpMockRepository
  private readonly _scenarioRepository: ScenarioRepository
  private readonly _mockProviders: Array<MockProvider> = []
  private readonly _plugins: Array<PluginRegistration<unknown>> = []

  constructor(config: ConfigurationBuilder | Configuration) {
    const configurations = config instanceof ConfigurationBuilder ? config.build() : config

    LoggerUtil.instance().subscribe(new PinoLogger(configurations.logLevel))

    this._configuration = configurations
    this._mockRepository = new HttpMockRepository()
    this._scenarioRepository = new ScenarioInMemoryRepository()
    this._context = new HttpContext(configurations, this._mockRepository, this._scenarioRepository)
    this._httpServer = new HttpServer(this._context)

    if (configurations.modeIsAtLeast('info')) {
      this.on('onRequestStart', onRequestReceived)
      this.on('onRequestNotMatched', onRequestNotMatched)
      this.on('onRequestMatched', onRequestMatched)
      this.on('onProxyRequest', onProxyRequest)
      this.on('onProxyResponse', onProxyResponse)
      this.on('onRecord', onRecord)
    }

    this._plugins.push(...configurations.plugins.map(plugin => ({ plugin })))
    this._mockProviders.push(defaultMockProviderFactory(this._configuration, this._httpServer))
    this._mockProviders.push(
      ...this._configuration.mockProviderFactories.map(provider =>
        provider(this._configuration, this._httpServer)
      )
    )

    this._httpServer.preSetup()
  }

  // endregion

  mock(...mockBuilder: Array<HttpMockBuilder | ((context: HttpContext) => HttpMock)>): Scope {
    notEmpty(mockBuilder)

    const added = mockBuilder
      .map(builder =>
        typeof builder === 'function' ? builder(this._context) : builder.build(this._context)
      )
      .map(mock => this._mockRepository.save(mock))
      .map(mock => mock.id)

    return new Scope(this._mockRepository, added)
  }

  mockProvider(provider: MockProvider): void {
    this._mockProviders.push(provider)
  }

  async start(): Promise<Info> {
    for (const plugin of this._plugins) {
      await plugin.plugin(this, this._configuration, plugin.opts)
    }

    return Promise.all([this.applyMocksFromProviders(), this._httpServer.start()]).then(
      ([_, info]) => {
        this._context.emit('onStart', { info })

        return info
      }
    )
  }

  rebuild(): Promise<void> {
    this.resetFileMocks()
    return this.applyMocksFromProviders()
  }

  on<E extends keyof Hooks>(hook: E, listener: (args: Hooks[E]) => void): this {
    notBlank(hook)
    this._context.on(hook, listener)
    return this
  }

  use(route: string | Middleware, middleware?: Middleware): void {
    this._httpServer.use(route, middleware)
  }

  register<Options>(plugin: Plugin<Options>, opts?: Options): void {
    this._plugins.push({ plugin: plugin as Plugin<unknown>, opts })
  }

  resetMocks(source?: MockSource): void {
    if (source) {
      this._mockRepository.removeBySource(source)
    } else {
      this._mockRepository.removeAll()
    }
  }

  resetFileMocks(): void {
    this._mockRepository.removeBySource('file')
  }

  finalize(): Promise<void> {
    this._mockRepository.removeAll()
    return this.close()
  }

  close(): Promise<void> {
    return this._httpServer.close().finally(() => this._context.emit('onClose'))
  }

  server(): Express {
    return this._httpServer.server()
  }

  serverInfo(): Info {
    return this._httpServer.info()
  }

  configuration(): Configuration {
    return this._configuration
  }

  // region Internal

  private applyMocksFromProviders(): Promise<void> {
    return Promise.all(this._mockProviders.map(provider => provider())).then(mocks =>
      mocks.flatMap(x => x).forEach(mock => this.mock(mock))
    )
  }

  // endregion
}
