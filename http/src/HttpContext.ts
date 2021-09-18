import { Context } from '@mockdog/core'
import { ScenarioRepository } from '@mockdog/core'
import { Configuration } from './config'
import { HookListener } from './hooks'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'

export class HttpContext
  extends HookListener
  implements Context<Configuration, HttpMock, HttpMockRepository>
{
  constructor(
    public readonly configuration: Configuration,
    public readonly mockRepository: HttpMockRepository,
    public readonly scenarioRepository: ScenarioRepository
  ) {
    super()
  }
}
