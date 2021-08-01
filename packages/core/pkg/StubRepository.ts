import { Stub } from './Stub'
import { StubSource } from './StubTypes'
import { Optional } from './utils'

export interface StubRepository<Request, ResDef, TheStub extends Stub<Request, ResDef>> {
  save(stub: TheStub): TheStub

  fetchSorted(): Array<TheStub>

  fetchById(id: string): Optional<TheStub>

  fetchByIds(...ids: Array<string>): Array<TheStub>

  removeById(id: string): void

  removeByIds(...ids: Array<string>): void

  removeBySource(source: StubSource): void

  removeAll(): void
}
