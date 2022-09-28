import { Configuration } from './configuration.js'
import { modeIsAtLeast } from './mode.js'

describe('modeIsAtLeast', function () {
  it('should return true when mode at least the provided value', function () {
    const config: Configuration = {
      mode: 'verbose',
      logLevel: 'info',
      plugins: [],
      mockProviderFactories: [],
    }

    expect(modeIsAtLeast(config, 'verbose')).toBeTruthy()
    expect(modeIsAtLeast(config, 'trace')).toBeFalsy()
  })
})
