import { equalTo } from '../equalTo.js'
import { not } from '../not.js'

describe('Not', function () {
  it('should negate another matcher', function () {
    const expected = 'value'
    const result = not(equalTo(expected))(expected)

    expect(result.pass).toBeFalsy()
    expect(not(equalTo(expected))('test').pass).toBeTruthy()
  })
})
