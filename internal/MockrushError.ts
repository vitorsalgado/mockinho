export class MockrushError extends Error {
  constructor(message: string, private readonly code: string) {
    super(message)
    this.name = 'mockrush.http.error'
  }
}
