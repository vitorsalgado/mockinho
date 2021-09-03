import { ConfigBuilder } from '../ConfigBuilder'

describe('config', function () {
  it('should return the correct mode', function () {
    const silent = new ConfigBuilder().mode('silent').build()
    const info = new ConfigBuilder().mode('info').build()

    expect(silent.modeIsAtLeast('silent')).toBeTruthy()
    expect(silent.modeIsAtLeast('info')).toBeFalsy()

    expect(info.modeIsAtLeast('info')).toBeTruthy()
    expect(info.modeIsAtLeast('silent')).toBeTruthy()
    expect(info.modeIsAtLeast('detailed')).toBeFalsy()
    expect(info.modeIsAtLeast('verbose')).toBeFalsy()
  })
})
