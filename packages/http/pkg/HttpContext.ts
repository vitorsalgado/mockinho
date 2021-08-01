import { Context, ScenarioInMemoryRepository, ScenarioRepository } from '@mockinho/core'
import { Configurations } from './config'
import { HttpEventListener } from './eventlisteners'
import { HttpServerFactory } from './HttpServer'
import { HttpStubRepository } from './stub'

export class HttpContext<
    ServerFactory extends HttpServerFactory,
    Config extends Configurations<ServerFactory>
  >
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
