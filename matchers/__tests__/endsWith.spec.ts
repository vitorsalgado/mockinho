import { noop } from '../_test.js'
import { endsWith } from '../endsWith.js'

describe('Ends With', function () {
  it('should return true when it ends with the expected value', function () {
    const expected = 'matcher'
    const value = 'testing new added matcher'

    const result = endsWith(expected)(value, noop())

    expect(result).toBeTruthy()
  })

  it('should return false when it does not end with the expected value', function () {
    const expected = 'testing'
    const value = 'testing new added matcher'

    const result = endsWith(expected)(value, noop())

    expect(result).toBeFalsy()
  })
})
