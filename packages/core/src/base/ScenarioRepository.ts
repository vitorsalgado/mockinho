import { Optional } from '../util'
import { Scenario } from './Scenario'

export interface ScenarioRepository {
  fetchByName(name: string): Optional<Scenario>

  fetchAll(): Array<Scenario>

  save(scenario: Scenario): Scenario

  createNewIfNeeded(name: string): Scenario
}
