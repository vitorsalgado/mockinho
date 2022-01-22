import { MockRepository } from './MockRepository'
import { Mock } from './Mock'
import { ScenarioRepository } from './ScenarioRepository'
import { Configuration } from './Configuration'

export interface Context<
  MOCK extends Mock,
  CONFIG extends Configuration,
  MOCK_REPO extends MockRepository<MOCK>
> {
  configuration: CONFIG

  mockRepository: MOCK_REPO

  scenarioRepository: ScenarioRepository
}
