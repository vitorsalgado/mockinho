import { anyOf } from '../anyOf'
import { contains } from '../contains'
import { equalsTo } from '../equalsTo'

describe('AnyOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(anyOf(equalsTo('test'), contains('abc'))('abc')).toBeTruthy()
    expect(anyOf(equalsTo('test'), contains('abc'))('wrong')).toBeFalsy()
  })
})
