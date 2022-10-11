import { Context } from '@mockdog/core'
import { HttpConfiguration } from './config/index.js'
import { HookListener } from './feat/hooks/index.js'
import { HttpMock, HttpMockRepository } from './mock.js'

export class HttpContext
  extends HookListener
  implements Context<HttpMock, HttpConfiguration, HttpMockRepository>
{
  constructor(
    public readonly configuration: HttpConfiguration,
    public readonly mockRepository: HttpMockRepository,
  ) {
    super()
  }
}
