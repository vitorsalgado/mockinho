import { bold, yellow, yellowBright } from 'colorette'
import { Mock } from './mock.js'
import { MockDogError } from './error.js'
import { MockRepository } from './mockrepository.js'

export class ScopePendingError extends MockDogError {
  constructor(pending: Array<Mock<unknown>>) {
    super(
      `There are still mocked requests have not been called.\n${pending.join('\n')}`,
      'ERR_HTTP_PENDING_SCOPE',
    )
  }
}

export class Scope<MOCK extends Mock> {
  constructor(
    private readonly mockRepository: MockRepository<MOCK>,
    private readonly mocks: Array<string>,
  ) {}

  isDone(): boolean {
    return this.mockRepository.fetchByIds(...this.mocks).every(x => x.hasBeenCalled())
  }

  ensureIsDone(): void {
    if (!this.isDone()) {
      throw new ScopePendingError(this.pendingMocks())
    }
  }

  pendingMocks(): Array<MOCK> {
    return this.mockRepository.fetchByIds(...this.mocks).filter(x => !x.hasBeenCalled())
  }

  abortPendingMocks(): void {
    this.mockRepository
      .fetchByIds(...this.mocks)
      .filter(x => !x.hasBeenCalled())
      .forEach(x => this.mockRepository.removeById(x.id))
  }

  printPendingMocks(): void {
    const pendingMocks = this.pendingMocks()

    if (pendingMocks.length === 0) {
      return
    }

    // eslint-disable-next-line no-console
    console.log(`${bold(yellowBright('Pending Mocks'))}\n`)

    this.pendingMocks()
      // eslint-disable-next-line no-console
      .forEach(x => console.log(`${yellow(x.toString())}`))
  }

  clean(): void {
    this.mockRepository.removeByIds(...this.mocks)

    while (this.mocks.length > 0) {
      this.mocks.pop()
    }
  }
}
