import { ScenarioInMemoryRepository } from '@mockinho/core'
import { HttpContext } from '../HttpContext'
import { HttpStubRepository } from '../stub'
import { ExpressConfigurationsBuilder } from '../config'

describe('HttpContext', function () {
  it('should provide deps instances', function () {
    const builder = new ExpressConfigurationsBuilder()

    const cfg = builder
      .port(3000)
      .host('127.0.0.1')
      .dynamicPort()
      .verbose(false)
      .loadFileStubs(false)
      .disableDefaultLogger(false)
      .defaultLoggerLevel('warn')
      .trace()
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 10 } })
      .build()

    const ctx = new HttpContext(cfg)

    expect(ctx.provideConfigurations()).toEqual(cfg)
    expect(ctx.provideStubRepository()).toBeInstanceOf(HttpStubRepository)
    expect(ctx.provideScenarioRepository()).toBeInstanceOf(ScenarioInMemoryRepository)
  })
})
