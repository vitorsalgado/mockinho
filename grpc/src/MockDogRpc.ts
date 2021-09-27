import { ScenarioRepository } from '@mockdog/core'
import { ScenarioInMemoryRepository } from '@mockdog/core'
import { notEmpty } from '@mockdog/core'
import { RpcServer } from './RpcServer'
import { Info } from './RpcServer'
import { RpcContext } from './RpcContext'
import { RpcConfigurationBuilder } from './config'
import { RpcConfiguration } from './config'
import { RpcMockRepository } from './mock'
import { RpcMockBuilder } from './mock'
import { RpcMock } from './mock'

export class MockDogRpc {
  private readonly _context: RpcContext
  private readonly _configuration: RpcConfiguration
  private readonly _mockRepository: RpcMockRepository
  private readonly _scenarioRepository: ScenarioRepository
  private readonly _server: RpcServer

  constructor(config: RpcConfigurationBuilder | RpcConfiguration) {
    const configuration = config instanceof RpcConfigurationBuilder ? config.build() : config

    this._configuration = configuration
    this._mockRepository = new RpcMockRepository()
    this._scenarioRepository = new ScenarioInMemoryRepository()
    this._context = new RpcContext(configuration, this._mockRepository, this._scenarioRepository)
    this._server = new RpcServer(this._context)

    this._server.preSetup()
  }

  start(): Promise<Info> {
    return this._server.start()
  }

  mock(...mockBuilder: Array<RpcMockBuilder | ((context: RpcContext) => RpcMock)>): void {
    notEmpty(mockBuilder)

    mockBuilder
      .map(builder =>
        typeof builder === 'function' ? builder(this._context) : builder.build(this._context)
      )
      .map(mock => this._mockRepository.save(mock))
      .map(mock => mock.id)
  }

  serverInfo(): Info {
    return this._server.info()
  }

  async finalize(): Promise<void> {
    this._server.close()
  }
}
