import { Optional } from '../util/index.js'
import { Scenario } from './Scenario.js'

export interface ScenarioRepository {
  fetchByName(name: string): Optional<Scenario>

  fetchAll(): Array<Scenario>

  save(scenario: Scenario): Scenario

  createNewIfNeeded(name: string): Scenario
}
