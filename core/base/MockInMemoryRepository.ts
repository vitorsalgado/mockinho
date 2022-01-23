import { Optional } from '../util/index.js'
import { Mock } from './Mock.js'
import { MockRepository } from './MockRepository.js'
import { MockSource } from './MockSource.js'

export abstract class MockInMemoryRepository<M extends Mock> implements MockRepository<M> {
  protected constructor(protected readonly mocks: Map<string, M> = new Map<string, M>()) {}

  save(mock: M): M {
    this.mocks.set(mock.id, mock)
    return mock
  }

  fetchSorted(): Array<M> {
    return [...this.mocks.values()].sort((a, b) => a.priority - b.priority)
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
    const toRemove = Array.from(this.mocks)
      .filter(x => x[1].source === source)
      .map(x => x[0])

    this.removeByIds(...toRemove)
  }

  removeAll(): void {
    this.mocks.clear()
  }
}
