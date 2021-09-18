import { MockInMemoryRepository } from '@mockdog/core'
import { HttpMock } from './HttpMock'

export class HttpMockRepository extends MockInMemoryRepository<HttpMock> {
  public constructor() {
    super()
  }
}
