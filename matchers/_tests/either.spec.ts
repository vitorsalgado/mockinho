import { equalTo } from '../equalTo.js'
import { either } from '../either.js'
import { contains } from '../contains.js'

describe('either', function () {
  it('should return true when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = either(equalTo(expected), equalTo('something-else'))

    expect(matcher(expected).pass).toBeTruthy()
  })

  it('should return true when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = either(equalTo('wrong-value'), contains(expected))

    expect(matcher(expected).pass).toBeTruthy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = either(equalTo(expected), contains(expected))

    expect(matcher(expected).pass).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = either(equalTo('wrong'), contains('also-wrong'))

    expect(matcher('right-value').pass).toBeFalsy()
  })
})
