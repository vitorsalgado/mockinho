import { createMatcher, Matcher, MatcherContext } from '../pkg/shared/matchers'
import { Context } from './Context'
import { ScenarioRepository } from './ScenarioRepository'
import { Stub } from './Stub'
import { StubRepository } from './StubRepository'

export const scenarioMatcher = (
  name: string,
  requiredState: string,
  newState?: string
): Matcher<undefined> =>
  createMatcher(
    'scenario',

    (
      value: undefined,
      ctx: MatcherContext<
        Stub<any>,
        Context<any, StubRepository<any, any, Stub<any>>, ScenarioRepository>
      >
    ): boolean => {
      const optScenario = ctx.context.provideScenarioRepository().fetchByName(name)

      if (optScenario.isEmpty()) {
        return true
      }

      const scenario = optScenario.get()

      if (scenario.state !== requiredState) {
        return false
      }

      if (newState) {
        scenario.updateState(newState)
        ctx.context.provideScenarioRepository().save(scenario)
      }

      return true
    }
  )
