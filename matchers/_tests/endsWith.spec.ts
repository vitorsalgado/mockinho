import { endsWith } from '../endsWith.js'

describe('Ends With', function () {
  it('should return true when it ends with the expected value', function () {
    const expected = 'matcher'
    const value = 'testing new added matcher'

    const result = endsWith(expected)(value)

    expect(result.pass).toBeTruthy()
  })

  it('should return false when it does not end with the expected value', function () {
    const expected = 'testing'
    const value = 'testing new added matcher'

    const result = endsWith(expected)(value)

    expect(result.pass).toBeFalsy()
  })
})
