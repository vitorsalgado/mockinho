import crypto from 'crypto'
import { Optional } from '@mockdog/x'

export class Scenario {
  public readonly id: string
  public readonly name: string
  private state: string

  constructor(id: string, name: string, state: string) {
    this.id = id
    this.name = name
    this.state = state
  }

  static newScenario = (name: string): Scenario =>
    new Scenario(crypto.randomUUID(), name.toLowerCase(), Scenario.STATE_STARTED)

  static STATE_STARTED = 'started'

  isStarted(): boolean {
    return this.state === Scenario.STATE_STARTED
  }

  currentState(): string {
    return this.state
  }

  updateState(newState: string): void {
    this.state = newState
  }
}

export class ScenarioRepository {
  private readonly scenarios = new Map<string, Scenario>()

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
