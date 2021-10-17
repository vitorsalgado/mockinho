import { FindMockResult } from '@mockdog/core'
import { RpcMock } from './RpcMock'
import { noMatchErrorMessage } from './noMatchErrorMessage'

export function noMatchError(result: FindMockResult<RpcMock>): Error {
  return new Error(noMatchErrorMessage(result))
}
