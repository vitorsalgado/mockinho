import { Scenario } from './Scenario'
import { ScenarioRepository } from './ScenarioRepository'
import { Optional } from './utils/Optional'

export class ScenarioInMemoryRepository implements ScenarioRepository {
  private readonly byNameMap = new Map<string, string>()

  constructor(private readonly scenarios = new Map<string, Scenario>()) {}

  fetchByName(name: string): Optional<Scenario> {
    const id = this.byNameMap.get(name.toLowerCase())

    if (!id) {
      return Optional.empty()
    }

    return Optional.ofNullable(this.scenarios.get(id))
  }

  createNewIfNeeded(name: string): Scenario {
    const normalizedName = name.toLowerCase()
    const id = this.byNameMap.get(normalizedName)

    if (id) {
      return this.scenarios.get(id)!
    }

    return this.save(Scenario.newScenario(normalizedName))
  }

  save(scenario: Scenario): Scenario {
    if (scenario.id) {
      this.scenarios.set(scenario.id, scenario)
      this.byNameMap.set(scenario.name, scenario.id)

      return scenario
    }

    this.byNameMap.set(scenario.name, scenario.id)
    this.scenarios.set(scenario.id, scenario)

    return scenario
  }

  fetchAll(): Array<Scenario> {
    return [...this.scenarios.values()]
  }
}
