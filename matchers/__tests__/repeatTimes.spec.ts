import { repeatTimes } from '../repeatTimes.js'

describe('repeatTimes', function () {
  it('should return false when hit times is greater than the limit', function () {
    const matcher = repeatTimes(2)

    expect(matcher()).toBeTruthy()
    expect(matcher()).toBeTruthy()
    expect(matcher()).toBeFalsy()
    expect(matcher()).toBeFalsy()
    expect(matcher()).toBeFalsy()
  })

  it('should not accept max lower than zero', function () {
    expect(() => repeatTimes(-1)).toThrowError()
  })
})
