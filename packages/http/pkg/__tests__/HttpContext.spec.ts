import { ScenarioInMemoryRepository } from '@mockinho/core'
import { FastifyConfigurationsBuilder } from '../config'
import { HttpContext } from '../HttpContext'
import { HttpStubRepository } from '../stub'

describe('HttpContext', function () {
  it('should provide deps instances', function () {
    const builder = new FastifyConfigurationsBuilder()

    const cfg = builder
      .port(3000)
      .host('127.0.0.1')
      .dynamicPort()
      .verbose(false)
      .loadFileStubs(false)
      .disableDefaultLogger(false)
      .defaultLoggerLevel('warn')
      .trace()
      .formBodyOptions({ bodyLimit: 1000 })
      .cors({ maxAge: 10 })
      .multiPartOptions({ addToBody: true })
      .build()

    const ctx = new HttpContext(cfg)

    expect(ctx.provideConfigurations()).toEqual(cfg)
    expect(ctx.provideStubRepository()).toBeInstanceOf(HttpStubRepository)
    expect(ctx.provideScenarioRepository()).toBeInstanceOf(ScenarioInMemoryRepository)
  })
})
