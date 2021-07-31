import { MockinhoError } from '../../../internal/MockinhoError'
import { ErrorCodes } from '../types'

export class InvalidStubFileError extends MockinhoError {
  constructor(message: string, public readonly filename: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_STUB_FILE)
  }
}
