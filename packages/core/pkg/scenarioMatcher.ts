import { Context } from './Context'
import { createMatcher } from './createMatcher'
import { Matcher } from './Matcher'
import { MatcherContext } from './MatcherContext'
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
        Stub<any, any, any, any>,
        Context<
          any,
          StubRepository<any, any, any, any, Stub<any, any, any, any>>,
          ScenarioRepository
        >
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
