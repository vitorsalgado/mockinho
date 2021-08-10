import Chalk from 'chalk'
import { MockinhoError } from '@mockinho/core'
import { ErrorCodes } from '../types'
import { HttpStubRepository } from './HttpStubRepository'
import { HttpStub } from './HttpStub'

export class PendingHttpStubScopeError extends MockinhoError {
  constructor(pending: Array<HttpStub>) {
    super(
      `There are still mocked requests have not been called.\n${pending.join('\n')}`,
      ErrorCodes.MR_ERR_PENDING_SCOPE
    )
  }
}

export class HttpStubScope {
  constructor(
    private readonly stubRepository: HttpStubRepository,
    private readonly stubs: Array<string>
  ) {}

  isDone(): boolean {
    return this.stubRepository.fetchByIds(...this.stubs).every(x => x.hasBeenCalled())
  }

  ensureIsDone(): void {
    if (!this.isDone()) {
      throw new PendingHttpStubScopeError(this.pendingMocks())
    }
  }

  pendingMocks(): Array<HttpStub> {
    return this.stubRepository.fetchByIds(...this.stubs).filter(x => !x.hasBeenCalled())
  }

  abortPendingMocks(): void {
    this.stubRepository
      .fetchByIds(...this.stubs)
      .filter(x => !x.hasBeenCalled())
      .forEach(x => this.stubRepository.removeById(x.id))
  }

  printPendingMocks(): void {
    const pendingMocks = this.pendingMocks()

    if (pendingMocks.length === 0) {
      return
    }

    // eslint-disable-next-line no-console
    console.log(`${Chalk.yellowBright.bold('Pending Mocks')}\n`)

    this.pendingMocks()
      // eslint-disable-next-line no-console
      .forEach(x => console.log(`${Chalk.yellow(x.toString())}`))
  }

  clean(): void {
    this.stubRepository.removeByIds(...this.stubs)

    while (this.stubs.length > 0) {
      this.stubs.pop()
    }
  }
}
