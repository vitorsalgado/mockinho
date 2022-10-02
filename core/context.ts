import { MockRepository } from './mockrepository.js'
import { Mock } from './mock.js'
import { Configuration } from './config.js'

export interface Context<
  MOCK extends Mock,
  CONFIG extends Configuration,
  MOCK_REPO extends MockRepository<MOCK>,
> {
  configuration: CONFIG

  mockRepository: MOCK_REPO
}
