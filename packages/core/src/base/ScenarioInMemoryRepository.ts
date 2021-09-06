import { Optional } from '../util'
import { Scenario } from './Scenario'
import { ScenarioRepository } from './ScenarioRepository'

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

    if (this.scenarios.has(normalizedName)) {
      return this.scenarios.get(normalizedName)!
    }

    return this.save(Scenario.newScenario(normalizedName))
  }
}
