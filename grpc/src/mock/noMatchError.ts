import { FindMockResult } from '@mockdog/core'
import { RpcMock } from './RpcMock.js'
import { noMatchErrorMessage } from './noMatchErrorMessage.js'

export function noMatchError(result: FindMockResult<RpcMock>): Error {
  return new Error(noMatchErrorMessage(result))
}
