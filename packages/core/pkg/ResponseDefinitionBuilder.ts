import { Context } from './Context'

export interface ResponseDefinitionBuilder<Ctx extends Context, Req, Res> {
  build(context: Ctx, request: Req): Res
}
