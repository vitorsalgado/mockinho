import { noop } from '../_test.js'
import { equalsTo } from '../equalsTo.js'
import { contains } from '../contains.js'
import { eitherAre } from '../eitherAre.js'

describe('eitherAre', function () {
  it('should return true when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = eitherAre(equalsTo(expected)).or(equalsTo('something-else'))

    expect(matcher(expected, noop())).toBeTruthy()
  })

  it('should return true when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = eitherAre(equalsTo('wrong-value')).or(contains(expected))

    expect(matcher(expected, noop())).toBeTruthy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = eitherAre(equalsTo(expected)).or(contains(expected))

    expect(matcher(expected, noop())).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = eitherAre(equalsTo('wrong')).or(contains('also-wrong'))

    expect(matcher('right-value', noop())).toBeFalsy()
  })
})
