export class MockinhoError extends Error {
  constructor(message: string, private readonly code: string) {
    super(message)
    this.name = 'mockinho.http.error'
  }
}
