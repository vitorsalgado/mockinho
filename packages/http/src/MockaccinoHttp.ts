import { Express } from 'express'
import { notBlank, notEmpty, MockSource } from '@mockinho/core'
import { Plugin } from '@mockinho/core'
import { ScenarioRepository } from '@mockinho/core'
import { ScenarioInMemoryRepository } from '@mockinho/core'
import { PinoLogger } from '@mockinho/core'
import { LoggerUtil } from '@mockinho/core'
import { ConfigBuilder } from './config'
import { HttpConfiguration } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './events'
import { HttpEvents } from './events'
import { HttpContext } from './HttpContext'
import { HttpMockBuilder, HttpMockScope } from './mock'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'
import { DefaultConfiguration } from './types'
import { MockProvider } from './mockproviders/MockProvider'
import { HttpServer, HttpServerInfo } from './HttpServer'
import { HttpRequest } from './HttpRequest'
import { defaultMockProviderFactory } from './mockproviders/default/defaultMockProviderFactory'

export class MockaccinoHttp {
  // --

  // region Ctor

  private readonly _context: HttpContext
  private readonly _httpServer: HttpServer
  private readonly _configuration: DefaultConfiguration
  private readonly _mockRepository: HttpMockRepository
  private readonly _scenarioRepository: ScenarioRepository
  private readonly _mockProviders: Array<MockProvider> = []
  private readonly _plugins: Array<Plugin<HttpRequest, HttpMock>> = []

  constructor(config: ConfigBuilder | HttpConfiguration) {
    const configurations = config instanceof ConfigBuilder ? config.build() : config

    LoggerUtil.instance().subscribe(new PinoLogger(configurations.logLevel))

    this._configuration = configurations
    this._mockRepository = new HttpMockRepository()
    this._scenarioRepository = new ScenarioInMemoryRepository()
    this._context = new HttpContext(configurations, this._mockRepository, this._scenarioRepository)
    this._httpServer = new HttpServer(this._context)

    if (configurations.modeIsAtLeast('info')) {
      this._context.on('request', onRequestReceived)
      this._context.on('requestNotMatched', onRequestNotMatched)
      this._context.on('requestMatched', onRequestMatched)
    }

    this._mockProviders.push(defaultMockProviderFactory(this._configuration, this._httpServer))
    this._mockProviders.push(
      ...this._configuration.mockProviderFactories.map(provider =>
        provider(this._configuration, this._httpServer)
      )
    )

    this._plugins.push(
      ...this._configuration.pluginFactories.map(
        factory => factory(this._context) as Plugin<HttpRequest, HttpMock>
      )
    )

    this._httpServer.preSetup()
  }

  // endregion

  // region Entrypoint

  mock(
    ...mockBuilder: Array<HttpMockBuilder | ((context: HttpContext) => HttpMock)>
  ): HttpMockScope {
    notEmpty(mockBuilder)

    const added = mockBuilder
      .map(builder =>
        typeof builder === 'function' ? builder(this._context) : builder.build(this._context)
      )
      .map(mock => {
        for (const plugin of this._plugins) {
          if (plugin.onMockInit) {
            mock = plugin.onMockInit(mock)
          }
        }

        return mock
      })
      .map(mock => this._mockRepository.save(mock))
      .map(mock => mock.id)

    return new HttpMockScope(this._mockRepository, added)
  }

  async start(): Promise<HttpServerInfo> {
    await this.applyMocksFromProviders()

    return this._httpServer.start().then(info => {
      this._context.emit('started', { info })

      return info
    })
  }

  rebuild(): Promise<void> {
    return this.applyMocksFromProviders()
  }

  on<E extends keyof HttpEvents>(event: E, listener: (args: HttpEvents[E]) => void): this {
    notBlank(event)
    this._context.on(event, listener)
    return this
  }

  configuration(): HttpConfiguration {
    return this._configuration
  }

  // endregion

  // region General Api

  removeAll(): void {
    this._mockRepository.removeAll()
  }

  removeFileMocks(): void {
    this._mockRepository.removeBySource('file')
  }

  removeBy(source: MockSource = 'code'): void {
    notBlank(source)
    this._mockRepository.removeBySource(source)
  }

  finalize(): Promise<void> {
    this._mockRepository.removeAll()
    return this.close()
  }

  close(): Promise<void> {
    return this._httpServer.close().finally(() => this._context.emit('closed'))
  }

  server(): Express {
    return this._httpServer.server()
  }

  info(): HttpServerInfo {
    return this._httpServer.info()
  }

  // endregion

  private applyMocksFromProviders(): Promise<void> {
    return Promise.all(this._mockProviders.map(provider => provider())).then(mocks =>
      mocks.flatMap(x => x).forEach(mock => this.mock(mock))
    )
  }
}
