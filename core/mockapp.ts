import { coreerr, LhamaError } from './error.js'
import { Scope } from './scope.js'
import { Server } from './srv.js'
import { MockRepository } from './mockrepository.js'
import { Mock, MockBuilder } from './mock.js'
import { PluginRegistration } from './plugin.js'
import { Configuration } from './config.js'
import { MockProvider } from './provider.js'
import { Plugin } from './plugin.js'

export abstract class MockApp<
  MOCK extends Mock,
  SRV_INF,
  SRV_IMPL,
  SRV extends Server<SRV_INF, SRV_IMPL>,
  DEPS,
  CONFIG extends Configuration,
> {
  protected readonly _mockServer: SRV
  protected readonly _configuration: CONFIG
  protected readonly _mockRepository: MockRepository<MOCK>
  protected readonly _mockProviders: Array<MockProvider<MockBuilder<MOCK, DEPS>>> = []
  protected readonly _plugins: Array<PluginRegistration> = []
  protected readonly _scopes: Array<Scope<MOCK>> = []
  protected readonly _parameters: Map<string, unknown> = new Map<string, unknown>()

  protected constructor(config: CONFIG, store: MockRepository<MOCK>) {
    this._configuration = config
    this._mockRepository = store

    this._plugins.push(...this._configuration.plugins.map(plugin => ({ plugin })))
    this._mockProviders.push(
      ...this._configuration.mockProviderFactories.map(
        provider => provider(this) as MockProvider<MockBuilder<MOCK, DEPS>>,
      ),
    )

    this._mockServer = this.buildServer()
  }

  get store() {
    return this._mockRepository
  }

  get scopes() {
    return [...this._scopes]
  }

  get config(): CONFIG {
    return this._configuration
  }

  get server(): SRV {
    return this._mockServer
  }

  get info(): SRV_INF {
    return this._mockServer.info
  }

  get parameters() {
    return this._parameters
  }

  protected abstract setup(): void

  protected abstract deps(): DEPS

  protected abstract buildServer(): SRV

  mockProvider(provider: MockProvider<MockBuilder<MOCK, DEPS>>): void {
    this._mockProviders.push(provider)
  }

  async start(): Promise<SRV_INF> {
    for (const plugin of this._plugins) {
      await plugin.plugin(this, plugin.options)
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
      options: opts,
    })
  }

  resetMocks(source?: string): void {
    if (source) {
      this._mockRepository.deleteBySource(source)
    } else {
      this._mockRepository.clear()
    }
  }

  resetFileMocks(): void {
    this._mockRepository.deleteBySource('file')
  }

  finalize(): Promise<void> {
    this._mockRepository.clear()
    return this.close()
  }

  close(): Promise<void> {
    return this._mockServer.close()
  }

  hits() {
    return this._scopes.reduce((acc, s) => acc + s.hits(), 0)
  }

  assertCalled() {
    for (let i = 0; i < this._scopes.length; i++) {
      const scope = this._scopes[i]

      try {
        scope.assertCalled()
      } catch (e) {
        throw coreerr.wrap(e as LhamaError, `Scope ${i} was not called:`)
      }
    }
  }

  assertNotCalled() {
    for (let i = 0; i < this._scopes.length; i++) {
      const scope = this._scopes[i]

      try {
        scope.assertNotCalled()
      } catch (e) {
        throw coreerr.wrap(e as LhamaError, `Scope ${i} was called:`)
      }
    }
  }

  assertHits(expected: number) {
    for (let i = 0; i < this._scopes.length; i++) {
      const scope = this._scopes[i]

      try {
        scope.assertHits(expected)
      } catch (e) {
        throw coreerr.wrap(e as LhamaError, `Scope ${i} doesn't have the expected hits:`)
      }
    }
  }

  printPending() {
    for (let i = 0; i < this._scopes.length; i++) {
      const scope = this._scopes[i]

      process.stdout.write(`Scope ${i}:\n`)
      scope.printPending()
    }
  }

  // region internals

  protected abstract applyMocksFromProviders(): Promise<void>

  // endregion
}
