import { ConfigurationBuilder } from '../ConfigurationBuilder'

describe('config', function () {
  it('should return the correct mode', function () {
    const silent = new ConfigurationBuilder().mode('silent').build()
    const info = new ConfigurationBuilder().mode('info').build()

    expect(silent.modeIsAtLeast('silent')).toBeTruthy()
    expect(silent.modeIsAtLeast('info')).toBeFalsy()

    expect(info.modeIsAtLeast('info')).toBeTruthy()
    expect(info.modeIsAtLeast('silent')).toBeTruthy()
    expect(info.modeIsAtLeast('verbose')).toBeFalsy()
    expect(info.modeIsAtLeast('trace')).toBeFalsy()
  })
})
