import { Matcher } from '../../base/Matcher'
import { SCENARIO_STATE_STARTED } from './Scenario'
import { ScenarioInMemoryRepository } from './ScenarioInMemoryRepository'

const scenarioRepository = new ScenarioInMemoryRepository()

export const scenarioMatcher = (
  name: string,
  requiredState: string,
  newState?: string
): Matcher => {
  if (requiredState === SCENARIO_STATE_STARTED) {
    scenarioRepository.createNewIfNeeded(name)
  }

  return function scenario(): boolean {
    const optScenario = scenarioRepository.fetchByName(name)

    if (optScenario.isEmpty()) {
      return true
    }

    const scenario = optScenario.get()

    if (scenario.state !== requiredState) {
      return false
    }

    if (newState) {
      scenario.updateState(newState)
      scenarioRepository.save(scenario)
    }

    return true
  }
}
