import { Mock } from './Mock'
import { MatcherContextHolder } from './MatcherContextHolder'
import { Matcher } from './Matcher'
import { Scenario } from './Scenario'
import { Configuration } from './Configuration'

export function scenarioMatcher<MOCK extends Mock, CONFIG extends Configuration>(
  name: string,
  requiredState: string = Scenario.STATE_STARTED,
  newState: string = ''
): MatcherContextHolder<MOCK, CONFIG> {
  return function (context): Matcher {
    if (requiredState === Scenario.STATE_STARTED) {
      context.scenarioRepository.createNewIfNeeded(name)
    }

    return function scenarioStatefulMatcher(): boolean {
      const scenarioOptional = context.scenarioRepository.fetchByName(name)

      if (scenarioOptional.isPresent()) {
        const scenario = scenarioOptional.get()

        if (scenario.currentState() === requiredState) {
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
