import { Context } from '@mockdog/core'
import { StateRepository } from '@mockdog/core'
import { HttpConfiguration } from './config/index.js'
import { HookListener } from './hooks/index.js'
import { HttpMockRepository } from './mock/index.js'
import { HttpMock } from './mock/index.js'

export class HttpContext
  extends HookListener
  implements Context<HttpMock, HttpConfiguration, HttpMockRepository>
{
  constructor(
    public readonly configuration: HttpConfiguration,
    public readonly mockRepository: HttpMockRepository,
    public readonly scenarioRepository: StateRepository,
  ) {
    super()
  }
}
