import { Context } from '@mockdog/core'
import { ScenarioRepository } from '@mockdog/core'
import { HttpConfiguration } from './config'
import { HookListener } from './hooks'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'

export class HttpContext
  extends HookListener
  implements Context<HttpMock, HttpConfiguration, HttpMockRepository>
{
  constructor(
    public readonly configuration: HttpConfiguration,
    public readonly mockRepository: HttpMockRepository,
    public readonly scenarioRepository: ScenarioRepository
  ) {
    super()
  }
}
