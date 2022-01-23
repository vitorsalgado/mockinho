import { Optional } from '../util/index.js'
import { Scenario } from './Scenario.js'
import { ScenarioRepository } from './ScenarioRepository.js'

export class ScenarioInMemoryRepository implements ScenarioRepository {
  constructor(private readonly scenarios = new Map<string, Scenario>()) {}

  fetchByName(name: string): Optional<Scenario> {
    return Optional.ofNullable(this.scenarios.get(name.toLowerCase()))
  }

  fetchAll(): Array<Scenario> {
    return [...this.scenarios.values()]
  }

  save(scenario: Scenario): Scenario {
    this.scenarios.set(scenario.name, scenario)
    return scenario
  }

  createNewIfNeeded(name: string): Scenario {
    const normalizedName = name.toLowerCase()
    const entry = this.scenarios.get(normalizedName)

    if (entry) {
      return entry
    }

    return this.save(Scenario.newScenario(normalizedName))
  }
}
