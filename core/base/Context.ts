import { MockRepository } from './MockRepository.js'
import { Mock } from './Mock.js'
import { ScenarioRepository } from './ScenarioRepository.js'
import { Configuration } from './Configuration.js'

export interface Context<
  MOCK extends Mock,
  CONFIG extends Configuration,
  MOCK_REPO extends MockRepository<MOCK>,
> {
  configuration: CONFIG

  mockRepository: MOCK_REPO

  scenarioRepository: ScenarioRepository
}
