import { MockDogError } from '../base'

export class LoadMockError extends MockDogError {
  constructor(message: string, public readonly filename: string) {
    super(message, 'ERR_HTTP_INVALID_MOCK_FILE')
  }
}
