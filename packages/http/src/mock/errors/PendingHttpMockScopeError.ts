import { MockaccinoError } from '@mockinho/core'
import { HttpMock } from '../HttpMock'
import { ErrorCodes } from '../../types'

export class PendingHttpMockScopeError extends MockaccinoError {
  constructor(pending: Array<HttpMock>) {
    super(
      `There are still mocked requests have not been called.\n${pending.join('\n')}`,
      ErrorCodes.ERR_PENDING_SCOPE
    )
  }
}
