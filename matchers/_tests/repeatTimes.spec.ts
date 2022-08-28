import { noop } from '../_test.js'
import { repeatTimes } from '../repeatTimes.js'

describe('repeatTimes', function () {
  it('should return false when hit times is greater than the limit', function () {
    const matcher = repeatTimes(2)

    expect(matcher(null, noop())).toBeTruthy()
    expect(matcher(null, noop())).toBeTruthy()
    expect(matcher(null, noop())).toBeFalsy()
    expect(matcher(null, noop())).toBeFalsy()
    expect(matcher(null, noop())).toBeFalsy()
  })

  it('should not accept max lower than zero', function () {
    expect(() => repeatTimes(-1)).toThrowError()
  })
})
