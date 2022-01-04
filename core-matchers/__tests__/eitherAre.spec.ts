import { equalsTo } from '../equalsTo'
import { contains } from '../contains'
import { eitherAre } from '../eitherAre'

describe('eitherAre', function () {
  it('should return true when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = eitherAre(equalsTo(expected)).or(equalsTo('something-else'))

    expect(matcher(expected)).toBeTruthy()
  })

  it('should return true when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = eitherAre(equalsTo('wrong-value')).or(contains(expected))

    expect(matcher(expected)).toBeTruthy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = eitherAre(equalsTo(expected)).or(contains(expected))

    expect(matcher(expected)).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = eitherAre(equalsTo('wrong')).or(contains('also-wrong'))

    expect(matcher('right-value')).toBeFalsy()
  })
})
