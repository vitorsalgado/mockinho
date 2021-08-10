import { MockPreInit } from './MockPreInit'
import { Context } from './Context'
import { ResponseDefinitionBuilder } from './ResponseDefinitionBuilder'
import { Stub } from './Stub'
import { SCENARIO_STATE_STARTED } from './Scenario'

export class ScenarioPreInit<
  Ctx extends Context,
  Req,
  Res,
  ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>,
  TheStub extends Stub<Ctx, Req, Res, ResBuilder>
> implements MockPreInit<Ctx, Req, Res, ResBuilder, TheStub>
{
  init(stub: TheStub, context: Ctx): void {
    if (stub.scenario) {
      if (stub.scenario.requiredState === SCENARIO_STATE_STARTED) {
        context.provideScenarioRepository().createNewIfNeeded(stub.scenario.name)
      }
    }
  }
}
