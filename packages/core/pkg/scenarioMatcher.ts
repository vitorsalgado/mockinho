import { Matcher } from './Matcher'
import { MatcherContext } from './MatcherContext'

export const scenarioMatcher = (
  name: string,
  requiredState: string,
  newState?: string
): Matcher<undefined> => {
  return function scenario(value: undefined, ctx?: MatcherContext): boolean {
    if (!ctx) {
      throw new ReferenceError('Context is required on "Scenario Matcher"!')
    }

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
}
