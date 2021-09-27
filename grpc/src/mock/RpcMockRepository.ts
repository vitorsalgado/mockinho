import { MockInMemoryRepository } from '@mockdog/core'
import { RpcMock } from './RpcMock'

export class RpcMockRepository extends MockInMemoryRepository<RpcMock> {
  public constructor() {
    super()
  }
}
