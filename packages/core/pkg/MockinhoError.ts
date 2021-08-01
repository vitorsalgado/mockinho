export class MockinhoError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'mockinho.http.error'
  }
}
