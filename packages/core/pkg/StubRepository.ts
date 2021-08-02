import { Stub } from './Stub'
import { StubSource } from './StubTypes'
import { Optional } from './utils'
import { Context } from './Context'
import { ResponseDefinitionBuilder } from './ResponseDefinitionBuilder'

export interface StubRepository<
  Ctx extends Context,
  Req,
  Res,
  ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>,
  TheStub extends Stub<Ctx, Req, Res, ResBuilder>
> {
  save(stub: TheStub): TheStub

  fetchSorted(): Array<TheStub>

  fetchById(id: string): Optional<TheStub>

  fetchByIds(...ids: Array<string>): Array<TheStub>

  removeById(id: string): void

  removeByIds(...ids: Array<string>): void

  removeBySource(source: StubSource): void

  removeAll(): void
}
