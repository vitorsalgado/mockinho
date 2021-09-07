export class MockaccinoError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message.startsWith('Mockaccino') ? message : 'Mockaccino: ' + message)
    this.name = 'mockaccino.error'
  }
}
