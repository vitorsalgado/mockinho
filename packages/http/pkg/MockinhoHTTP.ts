import { Server } from 'http'
import { LoggerUtil, notBlank, notEmpty, SCENARIO_STATE_STARTED, StubSource } from '@mockinho/core'
import { ConfigurationsBuilder } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './eventlisteners'
import { HttpContext } from './HttpContext'
import { HttpServer, HttpServerInfo } from './HttpServer'
import { buildStubFromFile } from './import/buildStubFromFile'
import { loadStubFiles } from './import/loadStubFiles'
import { HttpStubBuilder, HttpStubScope } from './stub'
import { DefaultConfigurations } from './types'
import { DefaultServerFactory } from './types'

export class MockinhoHTTP implements HttpServer {
  // --
  // region Ctor

  private readonly context: HttpContext
  private readonly httpServer: HttpServer
  private readonly configurations: DefaultConfigurations

  constructor(
    configurationsBuilder: ConfigurationsBuilder<DefaultServerFactory, DefaultConfigurations>
  ) {
    const configurations = configurationsBuilder.build()
    const context = new HttpContext(configurations)

    this.configurations = configurations
    this.httpServer = configurationsBuilder.provideServerFactory().build(context)

    configurations.loggers.forEach(log => LoggerUtil.instance().subscribe(log))

    this.context = context
    this.context.on('requestReceived', onRequestReceived)
    this.context.on('requestNotMatched', onRequestNotMatched)
    this.context.on('requestMatched', onRequestMatched)

    this.preSetup()
  }

  // endregion

  mock(...stubBuilders: Array<HttpStubBuilder>): HttpStubScope {
    notEmpty(stubBuilders)

    const added = stubBuilders
      .map(stubBuilder => {
        const stub = stubBuilder.build(this.context)

        if (stub.scenario) {
          if (stub.scenario.requiredState === SCENARIO_STATE_STARTED) {
            this.context.provideScenarioRepository().createNewIfNeeded(stub.scenario.name)
          }
        }

        return this.context.provideStubRepository().save(stub)
      })
      .map(stub => stub.id)

    return new HttpStubScope(this.context.provideStubRepository(), added)
  }

  // region Stub Api

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

  async start(): Promise<HttpServerInfo> {
    if (this.configurations.isStubFilesEnabled) {
      const loaded = await loadStubFiles(this.configurations.stubsDirectory, [
        `.${this.configurations.stubsExtension}.json`,
        `.${this.configurations.stubsExtension}.yml`,
        `.${this.configurations.stubsExtension}.yaml`
      ])

      loaded
        .map(item =>
          item.stubFile.map(stub => buildStubFromFile(this.configurations, stub, item.filename))
        )
        .flatMap(x => x)
        .forEach(stub => this.mock(stub))
    }

    return this.httpServer.start()
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
