import { ScenarioInMemoryRepository } from '@mockinho/core'
import { HttpContext } from '../HttpContext'
import { HttpConfigurationBuilder } from '../config'
import { HttpMockRepository } from '../mock'

describe('HttpContext', function () {
  it('should provide deps instances', function () {
    const builder = new HttpConfigurationBuilder()

    const cfg = builder
      .httpPort(3000)
      .dynamicHttpPort()
      .verbose(false)
      .loadMocks(false)
      .logLevel('warn')
      .trace()
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 10 } })
      .build()

    const ctx = new HttpContext(cfg, new HttpMockRepository(), new ScenarioInMemoryRepository())

    expect(ctx.configuration).toEqual(cfg)
    expect(ctx.mockRepository).toBeInstanceOf(HttpMockRepository)
    expect(ctx.scenarioRepository).toBeInstanceOf(ScenarioInMemoryRepository)
  })
})
