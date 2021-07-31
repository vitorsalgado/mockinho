import { MockrushError } from '../../../internal/MockrushError'
import { ErrorCodes } from '../types'

export class InvalidStubFileError extends MockrushError {
  constructor(message: string, public readonly filename: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_STUB_FILE)
  }
}
