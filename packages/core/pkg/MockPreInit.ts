import { Stub } from './Stub'
import { Context } from './Context'
import { ResponseDefinitionBuilder } from './ResponseDefinitionBuilder'

export interface MockPreInit<
  Ctx extends Context,
  Req,
  Res,
  ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>,
  TheStub extends Stub<Ctx, Req, Res, ResBuilder>
> {
  init(stub: TheStub, context: Ctx): void
}
