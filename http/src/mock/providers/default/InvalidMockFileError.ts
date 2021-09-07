import { MockaccinoError } from '@mockinho/core'
import { ErrorCodes } from '../../../types'

export class InvalidMockFileError extends MockaccinoError {
  constructor(message: string, public readonly filename: string) {
    super(message, ErrorCodes.ERR_INVALID_MOCK_FILE)
  }
}
