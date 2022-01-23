import { modeIsAtLeast } from '@mockdog/core'
import { HttpConfigurationBuilder } from '../HttpConfigurationBuilder'

describe('config', function () {
  it('should return the correct mode', function () {
    const silent = new HttpConfigurationBuilder().mode('silent').build()
    const info = new HttpConfigurationBuilder().mode('info').build()

    expect(modeIsAtLeast(silent, 'silent')).toBeTruthy()
    expect(modeIsAtLeast(silent, 'info')).toBeFalsy()

    expect(modeIsAtLeast(info, 'info')).toBeTruthy()
    expect(modeIsAtLeast(info, 'silent')).toBeTruthy()
    expect(modeIsAtLeast(info, 'verbose')).toBeFalsy()
    expect(modeIsAtLeast(info, 'trace')).toBeFalsy()
  })
})
