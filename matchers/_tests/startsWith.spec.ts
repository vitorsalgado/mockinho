import { startsWith } from '../text.js'

describe('Starts With', function () {
  it('should return true when it starts with the expected value', function () {
    const expected = 'testing'
    const value = 'testing new added matcher'

    const result = startsWith(expected)(value)

    expect(result.pass).toBeTruthy()
  })

  it('should return false when it does not start with the expected value', function () {
    const expected = 'new added'
    const value = 'testing new added matcher'

    const result = startsWith(expected)(value)

    expect(result.pass).toBeFalsy()
  })
})
