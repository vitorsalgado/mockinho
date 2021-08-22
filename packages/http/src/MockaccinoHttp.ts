import { Express } from 'express'
import { LoggerUtil, notBlank, notEmpty, MockSource } from '@mockinho/core'
import { Plugin } from '@mockinho/core'
import { HttpConfigurationBuilder } from './config'
import { HttpConfiguration } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './eventlisteners'
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

  private readonly context: HttpContext
  private readonly httpServer: HttpServer
  private readonly configuration: DefaultConfiguration
  private readonly mockRepository: HttpMockRepository
  private readonly mockProviders: Array<MockProvider> = []
  private readonly plugins: Array<Plugin<HttpRequest, HttpMock>> = []

  constructor(config: HttpConfigurationBuilder | HttpConfiguration) {
    const configurations = config instanceof HttpConfigurationBuilder ? config.build() : config

    this.configuration = configurations
    this.mockRepository = new HttpMockRepository()
    this.context = new HttpContext(configurations, this.mockRepository)
    this.httpServer = new HttpServer(this.context)

    configurations.loggers.forEach(log => LoggerUtil.instance().subscribe(log))

    this.context.on('requestReceived', onRequestReceived)
    this.context.on('requestNotMatched', onRequestNotMatched)
    this.context.on('requestMatched', onRequestMatched)

    this.mockProviders.push(defaultMockProviderFactory(this.configuration, this.httpServer))
    this.mockProviders.push(
      ...this.configuration.mockProviderFactories.map(x => x(this.configuration, this.httpServer))
    )

    this.plugins.push(
      ...this.configuration.pluginFactories.map(
        x => x(this.context) as Plugin<HttpRequest, HttpMock>
      )
    )

    this.httpServer.preSetup()
  }

  // endregion

  // region Entrypoint

  mock(
    ...mockBuilder: Array<HttpMockBuilder | ((context: HttpContext) => HttpMock)>
  ): HttpMockScope {
    notEmpty(mockBuilder)

    const added = mockBuilder
      .map(builder =>
        typeof builder === 'function' ? builder(this.context) : builder.build(this.context)
      )
      .map(mock => {
        for (const plugin of this.plugins) {
          if (plugin.onMockInit) {
            mock = plugin.onMockInit(mock)
          }
        }

        return mock
      })
      .map(mock => this.mockRepository.save(mock))
      .map(mock => mock.id)

    return new HttpMockScope(this.mockRepository, added)
  }

  async start(): Promise<HttpServerInfo> {
    await Promise.all(this.mockProviders.map(x => x())).then(mocks =>
      mocks.flatMap(x => x).forEach(m => this.mock(m))
    )

    return this.httpServer.start()
  }

  // endregion

  // region General Api

  cleanAll(): void {
    this.mockRepository.removeAll()
  }

  cleanMocksFromFileSystem(): void {
    this.mockRepository.removeBySource('file')
  }

  cleanMocksBySource(source: MockSource = 'code'): void {
    notBlank(source)

    this.mockRepository.removeBySource(source)
  }

  async finalize(): Promise<void> {
    this.mockRepository.removeAll()
    await this.close()
  }

  close(): Promise<void> {
    return this.httpServer.close()
  }

  server(): Express {
    return this.httpServer.server()
  }

  info(): HttpServerInfo {
    return this.httpServer.info()
  }

  // endregion
}
