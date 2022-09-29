import { hasLength } from '../hasLength.js'

describe('hasLength', function () {
  it('should return true when array length is equal to the provided value', function () {
    const len = 2
    const arr = ['js', 'ts']

    const result = hasLength(len)(arr)

    expect(result.pass).toBeTruthy()
  })

  it('should return true when string length is equal to the provided value', function () {
    const len = 10
    const str = 'unit-tests'

    const result = hasLength(len)(str)

    expect(result.pass).toBeTruthy()
  })

  it('should return false when length is different than the provided value', function () {
    const str = 'unit-tests'
    const strLen = 20

    const arr = ['js', 'ts']
    const arrLen = 1

    const strRes = hasLength(strLen)(str)
    const arrRes = hasLength(arrLen)(arr)

    expect(strRes.pass).toBeFalsy()
    expect(arrRes.pass).toBeFalsy()
  })
})
