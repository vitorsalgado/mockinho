import { empty } from '../index.js'

describe('empty', function () {
  it('should return true when array 0', function () {
    const result = empty()([])

    expect(result).toBeTruthy()
  })

  it('should return false when array length is greater than 0', function () {
    const result = empty()(['100'])

    expect(result).toBeFalsy()
  })
})
