import { Server } from 'http'
import { LoggerUtil, notBlank, notEmpty, StubSource } from '@mockinho/core'
import { MockPreInit } from '@mockinho/core'
import { ScenarioPreInit } from '@mockinho/core'
import { ConfigurationsBuilder } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './eventlisteners'
import { HttpContext } from './HttpContext'
import { HttpServer, HttpServerInfo } from './HttpServer'
import { HttpStubBuilder, HttpStubScope } from './stub'
import { HttpResponseDefinition } from './stub'
import { HttpResponseDefinitionBuilder } from './stub'
import { HttpStub } from './stub'
import { DefaultConfigurations } from './types'
import { DefaultServerFactory } from './types'
import { MockProvider } from './stubproviders/MockProvider'
import { DefaultMockProviderFactory } from './stubproviders/default/DefaultMockProviderFactory'
import { DefaultMockProvider } from './stubproviders/default/DefaultMockProvider'
import { HttpRequest } from './HttpRequest'

export class MockinhoHTTP {
  // --

  // region Ctor

  private readonly context: HttpContext
  private readonly httpServer: HttpServer
  private readonly configurations: DefaultConfigurations
  private readonly mockProviders: Array<MockProvider> = []
  private readonly mockPreInitializers: Array<
    MockPreInit<
      HttpContext,
      HttpRequest,
      HttpResponseDefinition,
      HttpResponseDefinitionBuilder,
      HttpStub
    >
  > = []

  constructor(
    configurationsBuilder: ConfigurationsBuilder<DefaultServerFactory, DefaultConfigurations>
  ) {
    const configurations = configurationsBuilder.build()
    const context = new HttpContext(configurations)

    this.configurations = configurations
    this.httpServer = configurationsBuilder.provideServerFactory().build(context)
    this.context = context

    configurations.loggers.forEach(log => LoggerUtil.instance().subscribe(log))

    this.context.on('requestReceived', onRequestReceived)
    this.context.on('requestNotMatched', onRequestNotMatched)
    this.context.on('requestMatched', onRequestMatched)

    const provider = new DefaultMockProviderFactory().build(this.configurations)

    ;(provider as DefaultMockProvider).addFieldParser(...this.configurations.mockFieldParsers)

    this.mockPreInitializers.push(new ScenarioPreInit() as any)
    this.mockProviders.push(provider)
    this.mockProviders.push(
      ...this.configurations.mockProviderFactories.map(x => x.build(this.configurations))
    )

    this.preSetup()
  }

  // endregion

  // region Entrypoint

  mock(...stubBuilders: Array<HttpStubBuilder>): HttpStubScope {
    notEmpty(stubBuilders)

    const added = stubBuilders
      .map(stubBuilder => {
        const stub = stubBuilder.build(this.context)

        this.mockPreInitializers.forEach(initializer => initializer.init(stub, this.context))

        return this.context.provideStubRepository().save(stub)
      })
      .map(stub => stub.id)

    return new HttpStubScope(this.context.provideStubRepository(), added)
  }

  async start(): Promise<HttpServerInfo> {
    await Promise.all(this.mockProviders.map(x => x.mocks(this.httpServer))).then(mocks =>
      mocks.flatMap(x => x).forEach(m => this.mock(m))
    )

    return this.httpServer.start()
  }

  // endregion

  // region General Api

  cleanAll(): void {
    this.context.provideStubRepository().removeAll()
  }

  cleanStubsFromFileSystem(): void {
    this.context.provideStubRepository().removeBySource('file')
  }

  cleanStubsBySource(source: StubSource = 'code'): void {
    notBlank(source)

    this.context.provideStubRepository().removeBySource(source)
  }

  async finalize(): Promise<void> {
    this.context.provideStubRepository().removeAll()
    await this.close()
  }

  preSetup(): void {
    this.httpServer.preSetup()
  }

  close(): Promise<void> {
    return this.httpServer.close()
  }

  server(): Server {
    return this.httpServer.server()
  }

  info(): HttpServerInfo {
    return this.httpServer.info()
  }

  // endregion
}
