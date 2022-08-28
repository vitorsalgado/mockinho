import { noop } from '../_test.js'
import { isPresent } from '../isPresent.js'

describe('Is Present', function () {
  it('should return true when value is present whatever the value is', function () {
    const str = 'txt'
    const num = 10
    const b = false
    const arr = ['hey']

    const strR = isPresent()(str, noop())
    const numR = isPresent()(num, noop())
    const bR = isPresent()(b, noop())
    const arrR = isPresent()(arr, noop())
    const emptyStr = isPresent()('', noop())
    const emptyArr = isPresent()([], noop())

    expect(strR).toBeTruthy()
    expect(numR).toBeTruthy()
    expect(bR).toBeTruthy()
    expect(arrR).toBeTruthy()
    expect(emptyStr).toBeFalsy()
    expect(emptyArr).toBeFalsy()
  })

  it('should return false when value is null or undefined', function () {
    expect(isPresent()(null, noop())).toBeFalsy()
    expect(isPresent()(undefined, noop())).toBeFalsy()
  })
})
