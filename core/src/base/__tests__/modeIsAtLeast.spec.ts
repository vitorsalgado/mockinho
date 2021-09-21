import { BaseConfiguration } from '../BaseConfiguration'
import { modeIsAtLeast } from '../modeIsAtLeast'

describe('modeIsAtLeast', function () {
  it('should return true when mode at least the provided value', function () {
    const config: BaseConfiguration = {
      mode: 'verbose',
      logLevel: 'info'
    }

    expect(modeIsAtLeast(config, 'verbose')).toBeTruthy()
    expect(modeIsAtLeast(config, 'trace')).toBeFalsy()
  })
})
