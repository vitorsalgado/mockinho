import { Context } from '@mockdog/core'
import { ScenarioRepository } from '@mockdog/core'
import { RpcConfiguration } from './config/mod.js'
import { RpcMockRepository } from './mock/mod.js'
import { RpcMock } from './mock/mod.js'

export class RpcContext implements Context<RpcMock, RpcConfiguration, RpcMockRepository> {
  constructor(
    public readonly configuration: RpcConfiguration,
    public readonly mockRepository: RpcMockRepository,
    public readonly scenarioRepository: ScenarioRepository,
  ) {}
}
