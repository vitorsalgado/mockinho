import { hasLength } from '../hasLength'
import { fakeMatcherContext } from './testUtils'

describe('hasLength', function () {
  it('should return true when array length is equal to the provided value', function () {
    const len = 2
    const arr = ['js', 'ts']

    const result = hasLength(len)(arr, fakeMatcherContext())

    expect(result).toBeTruthy()
  })

  it('should return true when string length is equal to the provided value', function () {
    const len = 10
    const str = 'unit-tests'

    const result = hasLength(len)(str, fakeMatcherContext())

    expect(result).toBeTruthy()
  })

  it('should return false when length is different than the provided value', function () {
    const str = 'unit-tests'
    const strLen = 20

    const arr = ['js', 'ts']
    const arrLen = 1

    const strRes = hasLength(strLen)(str, fakeMatcherContext())
    const arrRes = hasLength(arrLen)(arr, fakeMatcherContext())

    expect(strRes).toBeFalsy()
    expect(arrRes).toBeFalsy()
  })
})
