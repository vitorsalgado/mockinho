import { Context, ScenarioInMemoryRepository, ScenarioRepository } from '@mockinho/core'
import { Configurations } from './config'
import { HttpEventListener } from './eventlisteners'
import { HttpStubRepository } from './stub'
import { DefaultConfigurations } from './types'

export class HttpContext<Config extends Configurations = DefaultConfigurations>
  extends HttpEventListener
  implements Context<Config, HttpStubRepository, ScenarioRepository>
{
  private readonly _stubbingRepository: HttpStubRepository
  private readonly _scenarioRepository: ScenarioRepository

  constructor(private readonly _configurations: Config) {
    super()

    this._stubbingRepository = new HttpStubRepository()
    this._scenarioRepository = new ScenarioInMemoryRepository()
  }

  provideConfigurations(): Config {
    return this._configurations
  }

  provideScenarioRepository(): ScenarioRepository {
    return this._scenarioRepository
  }

  provideStubRepository(): HttpStubRepository {
    return this._stubbingRepository
  }
}
