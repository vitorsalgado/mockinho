import { BaseConfiguration } from './BaseConfiguration'
import { Mock } from './Mock'
import { StatefulMatcher } from './StatefulMatcher'
import { Matcher } from './Matcher'
import { Scenario } from './Scenario'

export function scenarioStatefulMatcher<C extends BaseConfiguration, M extends Mock>(
  name: string,
  requiredState: string = Scenario.STATE_STARTED,
  newState: string = ''
): StatefulMatcher<C, M> {
  return function (context): Matcher {
    if (requiredState === Scenario.STATE_STARTED) {
      context.scenarioRepository.createNewIfNeeded(name)
    }

    return function scenarioStatefulMatcher(): boolean {
      const scenarioOptional = context.scenarioRepository.fetchByName(name)

      if (scenarioOptional.isPresent()) {
        const scenario = scenarioOptional.get()

        if (scenario.state === requiredState) {
          if (newState) {
            scenario.updateState(newState)
            context.scenarioRepository.save(scenario)
          }

          return true
        } else {
          return false
        }
      }

      return true
    }
  }
}
