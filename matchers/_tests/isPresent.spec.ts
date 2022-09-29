import { isPresent } from '../isPresent.js'

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

    expect(strR.pass).toBeTruthy()
    expect(numR.pass).toBeTruthy()
    expect(bR.pass).toBeTruthy()
    expect(arrR.pass).toBeTruthy()
    expect(emptyStr.pass).toBeFalsy()
    expect(emptyArr.pass).toBeFalsy()
  })

  it('should return false when value is null or undefined', function () {
    expect(isPresent()(null).pass).toBeFalsy()
    expect(isPresent()(undefined).pass).toBeFalsy()
  })
})
