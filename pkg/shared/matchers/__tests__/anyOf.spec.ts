import { anyOf } from '../anyOf'
import { equalsTo } from '../equalsTo'
import { containing } from '../containing'
import { fakeMatcherContext } from './testUtils'

describe('AnyOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(anyOf(equalsTo('test'), containing('abc'))('abc', fakeMatcherContext())).toBeTruthy()
    expect(anyOf(equalsTo('test'), containing('abc'))('wrong', fakeMatcherContext())).toBeFalsy()
  })
})
