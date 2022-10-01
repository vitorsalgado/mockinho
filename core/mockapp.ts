import { MockSource } from './mock.js'
import { MockServer } from './srv.js'
import { MockRepository } from './mockrepository.js'
import { Mock } from './mock.js'
import { PluginRegistration } from './plugin.js'
import { Configuration } from './configuration.js'
import { Scope } from './scope.js'
import { MockBuilder } from './mockbuilder.js'
import { MockProvider } from './provider.js'
import { Plugin } from './plugin.js'
import { Context } from './context.js'

export abstract class MockApp<
  MOCK extends Mock,
  SERVER_INFO,
  SERVER extends MockServer<SERVER_INFO>,
  CONFIG extends Configuration,
  CONTEXT extends Context<MOCK, CONFIG, MockRepository<MOCK>>,
> {
  protected readonly _context: CONTEXT
  protected readonly _mockServer: SERVER
  protected readonly _configuration: CONFIG
  protected readonly _mockRepository: MockRepository<MOCK>
  protected readonly _mockProviders: Array<MockProvider<MockBuilder<MOCK>>> = []
  protected readonly _plugins: Array<PluginRegistration> = []

  protected constructor(context: CONTEXT, server: SERVER) {
    this._context = context
    this._configuration = context.configuration
    this._mockRepository = context.mockRepository
    this._mockServer = server

    this._plugins.push(...this._configuration.plugins.map(plugin => ({ plugin })))
    this._mockProviders.push(
      ...this._configuration.mockProviderFactories.map(
        provider => provider(this) as MockProvider<MockBuilder<MOCK>>,
      ),
    )

    this.setup()
    this._mockServer.setup()
  }

  protected abstract setup(): void

  mock(...mockBuilder: Array<MockBuilder<MOCK> | ((context: CONTEXT) => MOCK)>): Scope<MOCK> {
    const added = mockBuilder
      .map(builder => (typeof builder === 'function' ? builder(this._context) : builder.build()))
      .map(mock => this._mockRepository.save(mock))
      .map(mock => mock.id)

    return new Scope(this._mockRepository, added)
  }

  mockProvider(provider: MockProvider<MockBuilder<MOCK>>): void {
    this._mockProviders.push(provider)
  }

  async start(): Promise<SERVER_INFO> {
    for (const plugin of this._plugins) {
      await plugin.plugin(this, plugin.opts)
    }

    return Promise.all([this.applyMocksFromProviders(), this._mockServer.start()]).then(
      ([_, info]) => info,
    )
  }

  rebuild(): Promise<void> {
    this.resetFileMocks()
    return this.applyMocksFromProviders()
  }

  register<Options>(plugin: Plugin<Options, this>, opts?: Options): void {
    this._plugins.push({
      plugin: plugin as Plugin,
      opts,
    })
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
    return this._mockServer.close()
  }

  server(): SERVER {
    return this._mockServer
  }

  serverInfo(): SERVER_INFO {
    return this._mockServer.info()
  }

  configuration(): CONFIG {
    return this._configuration
  }

  // region Internal

  protected applyMocksFromProviders(): Promise<void> {
    return Promise.all(this._mockProviders.map(provider => provider())).then(mocks =>
      mocks.flatMap(x => x).forEach(mock => this.mock(mock)),
    )
  }

  // endregion
}
