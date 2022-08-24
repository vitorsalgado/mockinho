import { equalsTo } from '../index.js'
import { contains } from '../index.js'
import { both } from '../index.js'

describe('both', function () {
  it('should return false when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = both(equalsTo(expected), equalsTo('something-else'))

    expect(matcher(expected)).toBeFalsy()
  })

  it('should return false when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = both(equalsTo('wrong-value'), contains(expected))

    expect(matcher(expected)).toBeFalsy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = both(equalsTo(expected), contains(expected))

    expect(matcher(expected)).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = both(equalsTo('wrong'), contains('also-wrong'))

    expect(matcher('right-value')).toBeFalsy()
  })
})
