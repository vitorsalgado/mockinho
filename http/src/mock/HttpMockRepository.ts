import { MockInMemoryRepository } from '@mockdog/core'
import { HttpMock } from './HttpMock.js'

export class HttpMockRepository extends MockInMemoryRepository<HttpMock> {
  public constructor() {
    super()
  }
}
