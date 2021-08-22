import { MockaccinoError } from '@mockinho/core'
import { ErrorCodes } from '../../types'

export class InvalidResponseFixtureError extends MockaccinoError {
  constructor(message: string) {
    super(message, ErrorCodes.ERR_INVALID_RESPONSE_DEFINITION)
  }
}
