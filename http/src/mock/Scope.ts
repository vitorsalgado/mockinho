import { yellowBright, yellow, bold } from 'colorette'
import { MockaccinoError } from '@mockinho/core'
import { ErrorCodes } from '../types'
import { HttpMockRepository } from './HttpMockRepository'
import { HttpMock } from './HttpMock'

export class PendingScopeError extends MockaccinoError {
  constructor(pending: Array<HttpMock>) {
    super(
      `There are still mocked requests have not been called.\n${pending.join('\n')}`,
      ErrorCodes.ERR_PENDING_SCOPE
    )
  }
}

export class Scope {
  constructor(
    private readonly mockRepository: HttpMockRepository,
    private readonly mocks: Array<string>
  ) {}

  isDone(): boolean {
    return this.mockRepository.fetchByIds(...this.mocks).every(x => x.hasBeenCalled())
  }

  ensureIsDone(): void {
    if (!this.isDone()) {
      throw new PendingScopeError(this.pendingMocks())
    }
  }

  pendingMocks(): Array<HttpMock> {
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
