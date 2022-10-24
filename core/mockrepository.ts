import { Optional } from '@mockdog/x'
import { Mock } from './mock.js'

export class MockRepository<M extends Mock> {
  protected readonly _mocks: Map<string, M> = new Map<string, M>()

  save(mock: M): M {
    this._mocks.set(mock.id, mock)
    return mock
  }

  findAll(): Array<M> {
    return Array.from(this._mocks.values())
  }

  findEligible(): Array<M> {
    return [...this._mocks.values()].filter(x => x.enabled).sort((a, b) => a.priority - b.priority)
  }

  findById(id: string): Optional<M> {
    return Optional.ofNullable(this._mocks.get(id))
  }

  findByIds(...ids: Array<string>): Array<M> {
    return ids
      .map(id => this.findById(id))
      .filter(x => x.isPresent())
      .map(x => x.get())
  }

  deleteById(...ids: Array<string>): void {
    for (const id of ids) {
      this._mocks.delete(id)
    }
  }

  deleteBySource(source: string): void {
    const toRemove = Array.from(this._mocks)
      .filter(x => x[1].source === source)
      .map(x => x[0])

    this.deleteById(...toRemove)
  }

  clear(): void {
    this._mocks.clear()
  }
}
