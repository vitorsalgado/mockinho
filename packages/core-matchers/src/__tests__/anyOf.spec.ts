import { anyOf } from '../anyOf'
import { containing } from '../containing'
import { equalsTo } from '../equalsTo'

describe('AnyOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(anyOf(equalsTo('test'), containing('abc'))('abc')).toBeTruthy()
    expect(anyOf(equalsTo('test'), containing('abc'))('wrong')).toBeFalsy()
  })
})
