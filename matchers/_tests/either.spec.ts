import { noop } from '../_test.js'
import { equalsTo } from '../equalsTo.js'
import { either } from '../either.js'
import { contains } from '../contains.js'

describe('either', function () {
  it('should return true when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = either(equalsTo(expected), equalsTo('something-else'))

    expect(matcher(expected, noop())).toBeTruthy()
  })

  it('should return true when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = either(equalsTo('wrong-value'), contains(expected))

    expect(matcher(expected, noop())).toBeTruthy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = either(equalsTo(expected), contains(expected))

    expect(matcher(expected, noop())).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = either(equalsTo('wrong'), contains('also-wrong'))

    expect(matcher('right-value', noop())).toBeFalsy()
  })
})
