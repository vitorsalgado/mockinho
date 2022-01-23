import { MockDogError } from './MockDogError.js'
import { Mock } from './Mock.js'

export class ScopePendingError extends MockDogError {
  constructor(pending: Array<Mock>) {
    super(
      `There are still mocked requests have not been called.\n${pending.join('\n')}`,
      'ERR_HTTP_PENDING_SCOPE.js'
    )
  }
}
