export class MockaccinoError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'mockaccino.http.error'
  }
}
