import { anyOf } from '../anyOf.js'
import { contains } from '../contains.js'
import { equalTo } from '../equalTo.js'

describe('AnyOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(anyOf(equalTo('test'), contains('abc'))('abc').pass).toBeTruthy()
    expect(anyOf(equalTo('test'), contains('abc'))('wrong').pass).toBeFalsy()
  })
})
