export class MockDogError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message.startsWith('MockDog') ? message : 'MockDog: ' + message)
    this.name = 'mockdog.error'
  }
}
