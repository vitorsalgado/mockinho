import { Stub } from './Stub'
import { StubRepository } from './StubRepository'
import { StubSource } from './StubTypes'
import { Optional } from './utils'
import { Context } from './Context'
import { ResponseDefinitionBuilder } from './ResponseDefinitionBuilder'

export abstract class StubInMemoryRepository<
  Ctx extends Context,
  Req,
  Res,
  ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>,
  TheStub extends Stub<Ctx, Req, Res, ResBuilder>
> implements StubRepository<Ctx, Req, Res, ResBuilder, TheStub>
{
  protected constructor(
    protected readonly stubs: Map<string, TheStub> = new Map<string, TheStub>()
  ) {}

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
