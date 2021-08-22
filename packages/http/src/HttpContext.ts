import { Context } from '@mockinho/core'
import { HttpConfiguration } from './config'
import { HttpEventListener } from './eventlisteners'
import { HttpMockRepository } from './mock'
import { HttpMock } from './mock'

export class HttpContext
  extends HttpEventListener
  implements Context<HttpConfiguration, HttpMock, HttpMockRepository>
{
  constructor(
    public readonly configurations: HttpConfiguration,
    public readonly mockRepository: HttpMockRepository
  ) {
    super()
  }
}
