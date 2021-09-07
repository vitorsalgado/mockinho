import { MockInMemoryRepository } from '@mockinho/core'
import { HttpMock } from './HttpMock'

export class HttpMockRepository extends MockInMemoryRepository<HttpMock> {
  public constructor() {
    super()
  }
}
