import { Configuration } from './Configuration'
import { MockRepository } from './MockRepository'
import { Mock } from './Mock'
import { ScenarioRepository } from './ScenarioRepository'

export interface Context<
  Config extends Configuration,
  M extends Mock,
  MockRepo extends MockRepository<M>
> {
  configuration: Config

  mockRepository: MockRepo

  scenarioRepository: ScenarioRepository
}
