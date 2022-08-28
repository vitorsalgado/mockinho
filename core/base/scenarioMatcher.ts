import { Mock } from './Mock.js'
import { MatcherContextHolder } from './MatcherContextHolder.js'
import { Matcher } from './Matcher.js'
import { Scenario } from './Scenario.js'
import { Configuration } from './Configuration.js'

export function scenarioMatcher<MOCK extends Mock, CONFIG extends Configuration>(
  name: string,
  requiredState: string = Scenario.STATE_STARTED,
  newState: string = '.js',
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
