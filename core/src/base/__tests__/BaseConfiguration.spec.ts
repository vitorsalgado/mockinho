import { BaseConfiguration } from '../BaseConfiguration'

describe('BaseConfiguration', function () {
  it('should init base configuration', function () {
    class TestConfig extends BaseConfiguration {
      public constructor() {
        super('info', 'verbose')
      }
    }

    const config = new TestConfig()

    expect(config.mode).toEqual('verbose')
    expect(config.logLevel).toEqual('info')
    expect(config.modeIsAtLeast('verbose')).toBeTruthy()
    expect(config.modeIsAtLeast('trace')).toBeFalsy()
  })
})
