import { MockDogError } from '@mockdog/core'
import { ErrorCodes } from '../../../ErrorCodes'

export class InvalidMockFileError extends MockDogError {
  constructor(message: string, public readonly filename: string) {
    super(message, ErrorCodes.ERR_INVALID_MOCK_FILE)
  }
}
