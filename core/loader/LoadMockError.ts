export class LoadMockError extends Error {
  constructor(message: string, public readonly filename: string) {
    super(message + 'ERR_HTTP_INVALID_MOCK_FILE')
  }
}
