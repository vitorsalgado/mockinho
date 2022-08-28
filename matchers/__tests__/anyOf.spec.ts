import { noop } from '../_test.js'
import { anyOf } from '../anyOf.js'
import { contains } from '../contains.js'
import { equalsTo } from '../equalsTo.js'

describe('AnyOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(anyOf(equalsTo('test'), contains('abc'))('abc', noop())).toBeTruthy()
    expect(anyOf(equalsTo('test'), contains('abc'))('wrong', noop())).toBeFalsy()
  })
})
