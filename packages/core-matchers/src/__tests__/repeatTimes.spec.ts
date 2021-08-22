import { repeatTimes } from '../repeatTimes'

describe('repeatTimes', function () {
  it('should return false when hit times is greater than the limit', function () {
    const matcher = repeatTimes(2)

    expect(matcher()).toBeTruthy()
    expect(matcher()).toBeTruthy()
    expect(matcher()).toBeFalsy()
    expect(matcher()).toBeFalsy()
    expect(matcher()).toBeFalsy()
  })
})
