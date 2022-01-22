import { isPresent } from '../isPresent'

describe('Is Present', function () {
  it('should return true when value is present whatever the value is', function () {
    const str = 'txt'
    const num = 10
    const b = false
    const arr = ['hey']

    const strR = isPresent()(str)
    const numR = isPresent()(num)
    const bR = isPresent()(b)
    const arrR = isPresent()(arr)
    const emptyStr = isPresent()('')
    const emptyArr = isPresent()([])

    expect(strR).toBeTruthy()
    expect(numR).toBeTruthy()
    expect(bR).toBeTruthy()
    expect(arrR).toBeTruthy()
    expect(emptyStr).toBeFalsy()
    expect(emptyArr).toBeFalsy()
  })

  it('should return false when value is null or undefined', function () {
    expect(isPresent()(null)).toBeFalsy()
    expect(isPresent()(undefined)).toBeFalsy()
  })
})
