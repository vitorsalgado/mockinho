import { Stub } from './Stub'
import { StubRepository } from './StubRepository'
import { StubSource } from './StubTypes'
import { Optional } from './utils'

export abstract class StubInMemoryRepository<Req, ResDef, TheStub extends Stub<Req, ResDef>>
  implements StubRepository<Req, ResDef, TheStub>
{
  constructor(protected readonly stubs: Map<string, TheStub> = new Map<string, TheStub>()) {}

  save(stub: TheStub): TheStub {
    this.stubs.set(stub.id, stub)
    return stub
  }

  fetchSorted(): Array<TheStub> {
    return [...this.stubs.values()].sort(x => x.priority)
  }

  fetchById(id: string): Optional<TheStub> {
    return Optional.ofNullable(this.stubs.get(id))
  }

  fetchByIds(...ids: Array<string>): Array<TheStub> {
    return ids
      .map(id => this.fetchById(id))
      .filter(x => x.isPresent())
      .map(x => x.get())
  }

  removeById(id: string): void {
    this.stubs.delete(id)
  }

  removeByIds(...ids: Array<string>): void {
    ids.forEach(id => this.stubs.delete(id))
  }

  removeBySource(source: StubSource): void {
    this.removeByIds(
      ...Array.from(this.stubs)
        .filter(x => x[1].source === source)
        .map(x => x[0])
    )
  }

  removeAll(): void {
    this.stubs.clear()
  }
}
