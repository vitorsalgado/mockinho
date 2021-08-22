import { Optional } from '../util'
import { Mock } from './Mock'
import { MockRepository } from './MockRepository'
import { MockSource } from './MockSource'

export abstract class MockInMemoryRepository<M extends Mock> implements MockRepository<M> {
  protected constructor(protected readonly mocks: Map<string, M> = new Map<string, M>()) {}

  save(mock: M): M {
    this.mocks.set(mock.id, mock)
    return mock
  }

  fetchSorted(): Array<M> {
    return [...this.mocks.values()].sort(x => x.priority)
  }

  fetchById(id: string): Optional<M> {
    return Optional.ofNullable(this.mocks.get(id))
  }

  fetchByIds(...ids: Array<string>): Array<M> {
    return ids
      .map(id => this.fetchById(id))
      .filter(x => x.isPresent())
      .map(x => x.get())
  }

  removeById(id: string): void {
    this.mocks.delete(id)
  }

  removeByIds(...ids: Array<string>): void {
    ids.forEach(id => this.mocks.delete(id))
  }

  removeBySource(source: MockSource): void {
    this.removeByIds(
      ...Array.from(this.mocks)
        .filter(x => x[1].source === source)
        .map(x => x[0])
    )
  }

  removeAll(): void {
    this.mocks.clear()
  }
}
