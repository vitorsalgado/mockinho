import { MockinhoError } from '@mockinho/core'
import { ErrorCodes } from '../types'

export interface ClosestMatch {
  id: string
  name: string
  filename: string
}

export class StubNotFoundError extends MockinhoError {
  constructor(
    public readonly statusCode: number = 500,
    public readonly closesMatches: Array<ClosestMatch>
  ) {
    super('No stub found for request!', ErrorCodes.MR_NO_STUB_FOUND)
  }
}
