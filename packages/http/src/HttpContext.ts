import { Context } from '@mockinho/core'
import { ScenarioRepository } from '@mockinho/core'
import { HttpConfiguration } from './config'
import { HttpEventListener } from './eventlisteners'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'

export class HttpContext
  extends HttpEventListener
  implements Context<HttpConfiguration, HttpMock, HttpMockRepository>
{
  constructor(
    public readonly configuration: HttpConfiguration,
    public readonly mockRepository: HttpMockRepository,
    public readonly scenarioRepository: ScenarioRepository
  ) {
    super()
  }
}
