import { ScenarioRepository } from '@mockdog/core'
import { HttpContext } from '../HttpContext'
import { HttpConfigurationBuilder } from '../config'
import { HttpMockRepository } from '../mock'

describe('HttpContext', function () {
  it('should provide deps instances', function () {
    const builder = new HttpConfigurationBuilder()

    const cfg = builder
      .httpPort(3000)
      .dynamicHttpPort()
      .enableFileMocks(false)
      .internalLogLevel('warn')
      .trace()
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 10 } })
      .build()

    const ctx = new HttpContext(cfg, new HttpMockRepository(), new ScenarioRepository())

    expect(ctx.configuration).toEqual(cfg)
    expect(ctx.mockRepository).toBeInstanceOf(HttpMockRepository)
    expect(ctx.scenarioRepository).toBeInstanceOf(ScenarioRepository)
  })
})
