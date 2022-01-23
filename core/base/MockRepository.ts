import { Optional } from '../util/index.js'
import { Mock } from './Mock.js'
import { MockSource } from './MockSource.js'

export interface MockRepository<M extends Mock> {
  save(mock: M): M

  fetchSorted(): Array<M>

  fetchById(id: string): Optional<M>

  fetchByIds(...ids: Array<string>): Array<M>

  removeById(id: string): void

  removeByIds(...ids: Array<string>): void

  removeBySource(source: MockSource): void

  removeAll(): void
}
