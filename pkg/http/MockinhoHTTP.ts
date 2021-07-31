import { Server } from 'http'
import { LoggerUtil } from '../../internal/log/LoggerUtil'
import { notBlank } from '../../internal/preconditions/notBlank'
import { notEmpty } from '../../internal/preconditions/notEmpty'
import { SCENARIO_STATE_STARTED } from '../../internal/Scenario'
import { StubSource } from '../../internal/StubTypes'
import { Configurations, ConfigurationsBuilder } from './config'
import { onRequestMatched, onRequestNotMatched, onRequestReceived } from './eventlisteners'
import { HttpContext } from './HttpContext'
import { HttpServer, HttpServerFactory, HttpServerInfo } from './HttpServer'
import { buildStubFromFile } from './import/buildStubFromFile'
import { loadStubFiles } from './import/loadStubFiles'
import { HttpStubBuilder, HttpStubScope } from './stub'

export class MockinhoHTTP<
  ServerFactory extends HttpServerFactory,
  Config extends Configurations<ServerFactory>
> implements HttpServer
{
  // region Ctor

  private readonly context: HttpContext<ServerFactory, Config>
  private readonly httpServer: HttpServer
  private readonly configurations: Config

  constructor(configurationsBuilder: ConfigurationsBuilder<ServerFactory, Config>) {
    const configurations = configurationsBuilder.build()
    const context = new HttpContext(configurations)

    this.configurations = configurations
    this.httpServer = configurations.serverFactory.build(context)

    configurations.loggers.forEach(log => LoggerUtil.INSTANCE.subscribe(log))

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

  close(): Promise<void> {
    return this.httpServer.close()
  }

  info(): HttpServerInfo {
    return this.httpServer.info()
  }

  server(): Server {
    return this.httpServer.server()
  }

  async start(): Promise<string> {
    if (this.configurations.loadFileStubs) {
      const loaded = await loadStubFiles(
        this.configurations.stubsDirectory,
        this.configurations.stubsBodyContentDirectory,
        ['.json', '.yml', '.yaml']
      )

      loaded
        .map(item =>
          item.stubFile.map(stub => buildStubFromFile(this.configurations, stub, item.filename))
        )
        .flatMap(x => x)
        .forEach(stub => this.mock(stub))
    }

    return this.httpServer.start()
  }

  // endregion
}
