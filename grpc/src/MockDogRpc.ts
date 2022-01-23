import { ScenarioInMemoryRepository } from '@mockdog/core'
import { MockApp } from '@mockdog/core'
import { RpcServer } from './RpcServer.js'
import { RpcContext } from './RpcContext.js'
import { RpcConfigurationBuilder } from './config/mod.js'
import { RpcConfiguration } from './config/mod.js'
import { RpcMockRepository } from './mock/mod.js'
import { RpcMock } from './mock/mod.js'
import { RpcServerInfo } from './RpcServerInfo.js'

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

  protected setup(): void {
    // No setup needed
  }
}
