import { MockInMemoryRepository } from '@mockdog/core'
import { RpcMock } from './RpcMock.js'

export class RpcMockRepository extends MockInMemoryRepository<RpcMock> {
  public constructor() {
    super()
  }
}
