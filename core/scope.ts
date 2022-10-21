import { bold, yellow, yellowBright } from 'colorette'
import { fmt } from '@mockdog/x'
import { coreerr } from './error.js'
import { Mock } from './mock.js'
import { MockRepository } from './mockrepository.js'

export class Scope<M extends Mock> {
  constructor(private readonly _repository: MockRepository<M>, private readonly _mocks: Array<M>) {}

  get mocks(): Array<M> {
    return [...this._mocks]
  }

  findById(id: string): M {
    const mock = this._mocks.find(x => x.id === id)

    if (mock === undefined) {
      throw coreerr.ErrScopePending(id)
    }

    return mock
  }

  findPending(): Array<M> {
    return this._mocks.filter(x => x.enabled).filter(x => !x.hasBeenCalled())
  }

  findCalled(): Array<M> {
    return this._mocks.filter(x => x.enabled).filter(x => x.hasBeenCalled())
  }

  hasBeenCalled(): boolean {
    return this._mocks.filter(x => x.enabled).every(x => x.hasBeenCalled())
  }

  isPending(): boolean {
    return this._mocks.filter(x => x.enabled).some(x => !x.hasBeenCalled())
  }

  deactivate() {
    for (const mock of this._mocks) {
      mock.deactivate()
    }
  }

  activate() {
    for (const mock of this._mocks) {
      mock.activate()
    }
  }

  delete(id?: string) {
    if (typeof id === 'string') {
      this._repository.deleteById(id)
      this._mocks.splice(
        this._mocks.findIndex(x => x.id === id),
        1,
      )
    } else {
      this._repository.deleteById(...this._mocks.map(x => x.id))
      while (this._mocks.length > 0) {
        this._mocks.pop()
      }
    }
  }

  clean(): void {
    this._repository.deleteById(...this._mocks.map(x => x.id))

    for (let i = this._mocks.length - 1; i > -1; i--) {
      this._repository.deleteById(this._mocks[i].id)
      this._mocks.pop()
    }
  }

  hits(): number {
    return this._mocks.reduce((acc, m) => acc + m.hits, 0)
  }

  assertCalled() {
    if (this.isPending()) {
      throw coreerr.ErrScopePending(
        'There are still mocks pending:\n' +
          fmt.indent(
            this.findPending()
              .map(x => x.hint())
              .join('\n'),
          ),
      )
    }
  }

  assertNotCalled() {
    if (this.hasBeenCalled()) {
      throw coreerr.ErrScopeNotPending(
        'Some mocks were called when none was expected:\n' +
          fmt.indent(
            this.findCalled()
              .map(x => x.hint())
              .join('\n'),
          ),
      )
    }
  }

  assertHits(expected: number) {
    if (this.hits() !== expected) {
      throw coreerr.ErrScopeNotPending(`Expected hits to be: ${expected}. Got: ${this.hits()}`)
    }
  }

  printPending() {
    const pendingMocks = this.findPending()

    if (pendingMocks.length === 0) {
      return
    }

    let msg = `${bold(yellowBright('Pending Mocks:'))}\n`

    for (const mock of this.findPending()) {
      msg += fmt.indent(`${yellow(mock.toString())}\n`)
    }

    process.stdout.write(msg)
  }
}
