import { ScenarioInMemoryRepository } from '@mockdog/core'
import { MockApp } from '@mockdog/core'
import { RpcServer } from './RpcServer'
import { RpcContext } from './RpcContext'
import { RpcConfigurationBuilder } from './config'
import { RpcConfiguration } from './config'
import { RpcMockRepository } from './mock'
import { RpcMock } from './mock'
import { RpcServerInfo } from './RpcServerInfo'

export class MockDogRpc extends MockApp<
  RpcMock,
  RpcServerInfo,
  RpcServer,
  RpcConfiguration,
  RpcContext
> {
  constructor(config: RpcConfigurationBuilder | RpcConfiguration) {
    const configurations = config instanceof RpcConfigurationBuilder ? config.build() : config
    const context = new RpcContext(
      configurations,
      new RpcMockRepository(),
      new ScenarioInMemoryRepository()
    )
    const server = new RpcServer(context)

    super(context, server)
  }

  setup(): void {
    // No setup needed
  }
}
