import { Scenario } from './Scenario'
import { Optional } from './utils'

export interface ScenarioRepository {
  fetchByName(name: string): Optional<Scenario>

  fetchAll(): Array<Scenario>

  save(scenario: Scenario): Scenario

  createNewIfNeeded(name: string): Scenario
}
