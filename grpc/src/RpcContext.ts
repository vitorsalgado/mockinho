import { Context } from '@mockdog/core'
import { ScenarioRepository } from '@mockdog/core'
import { RpcConfiguration } from './config'
import { RpcMockRepository } from './mock'
import { RpcMock } from './mock'

export class RpcContext implements Context<RpcConfiguration, RpcMock, RpcMockRepository> {
  constructor(
    public readonly configuration: RpcConfiguration,
    public readonly mockRepository: RpcMockRepository,
    public readonly scenarioRepository: ScenarioRepository
  ) {}
}
