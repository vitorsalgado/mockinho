import { isPresent } from '../isPresent'
import { fakeMatcherContext } from '../testUtils'

describe('Is Present', function () {
  it('should return true when value is present whatever the value is', function () {
    const str = 'txt'
    const num = 10
    const b = false
    const arr = ['hey']

    const strR = isPresent()(str, fakeMatcherContext())
    const numR = isPresent()(num, fakeMatcherContext())
    const bR = isPresent()(b, fakeMatcherContext())
    const arrR = isPresent()(arr, fakeMatcherContext())
    const emptyStr = isPresent()('', fakeMatcherContext())
    const emptyArr = isPresent()([], fakeMatcherContext())

    expect(strR).toBeTruthy()
    expect(numR).toBeTruthy()
    expect(bR).toBeTruthy()
    expect(arrR).toBeTruthy()
    expect(emptyStr).toBeFalsy()
    expect(emptyArr).toBeFalsy()
  })
})
