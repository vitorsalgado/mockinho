import { ScenarioRepository } from './ScenarioRepository'
import { StubRepository } from './StubRepository'

export interface Context<
  Config = any,
  StubRepo extends StubRepository<any, any, any> = any,
  ScenarioRepo extends ScenarioRepository = any
> {
  provideConfigurations(): Config

  provideStubRepository(): StubRepo

  provideScenarioRepository(): ScenarioRepo
}
