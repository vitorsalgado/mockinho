import { Mode } from '@mockinho/core'
import { HttpConfigurationBuilder } from '../HttpConfigurationBuilder'

describe('config', function () {
  it('should return the correct mode', function () {
    const silent = new HttpConfigurationBuilder().mode(Mode.silent).build()
    const info = new HttpConfigurationBuilder().mode(Mode.info).build()

    expect(silent.modeIs(Mode.silent)).toBeTruthy()
    expect(silent.modeIs(Mode.info)).toBeFalsy()

    expect(info.modeIs(Mode.info)).toBeTruthy()
    expect(info.modeIs(Mode.silent)).toBeTruthy()
    expect(info.modeIs(Mode.detailed)).toBeFalsy()
    expect(info.modeIs(Mode.verbose)).toBeFalsy()
  })
})
