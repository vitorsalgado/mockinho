import { equalTo } from '../index.js'
import { contains } from '../index.js'
import { both } from '../index.js'

describe('both', function () {
  it('should return false when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = both(equalTo(expected), equalTo('something-else'))

    expect(matcher(expected).pass).toBeFalsy()
  })

  it('should return false when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = both(equalTo('wrong-value'), contains(expected))

    expect(matcher(expected).pass).toBeFalsy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = both(equalTo(expected), contains(expected))

    expect(matcher(expected).pass).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = both(equalTo('wrong'), contains('also-wrong'))

    expect(matcher('right-value').pass).toBeFalsy()
  })
})
