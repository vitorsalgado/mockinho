import { BaseConfiguration } from './BaseConfiguration'
import { MockRepository } from './MockRepository'
import { Mock } from './Mock'
import { ScenarioRepository } from './ScenarioRepository'

export interface Context<
  Config extends BaseConfiguration,
  M extends Mock,
  MockRepo extends MockRepository<M>
> {
  configuration: Config

  mockRepository: MockRepo

  scenarioRepository: ScenarioRepository
}
