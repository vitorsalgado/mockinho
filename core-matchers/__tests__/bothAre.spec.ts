import { equalsTo } from '../equalsTo'
import { contains } from '../contains'
import { bothAre } from '../bothAre'

describe('bothAre', function () {
  it('should return false when only left matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = bothAre(equalsTo(expected)).and(equalsTo('something-else'))

    expect(matcher(expected)).toBeFalsy()
  })

  it('should return false when only right matcher evaluates to true', function () {
    const expected = 'value'
    const matcher = bothAre(equalsTo('wrong-value')).and(contains(expected))

    expect(matcher(expected)).toBeFalsy()
  })

  it('should return true when both matchers evaluates to true', function () {
    const expected = 'value'
    const matcher = bothAre(equalsTo(expected)).and(contains(expected))

    expect(matcher(expected)).toBeTruthy()
  })

  it('should return false when both matcher returns false', function () {
    const matcher = bothAre(equalsTo('wrong')).and(contains('also-wrong'))

    expect(matcher('right-value')).toBeFalsy()
  })
})
