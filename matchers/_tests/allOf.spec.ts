import { allOf } from '../allOf.js'
import { contains } from '../contains.js'
import { equalTo } from '../equalTo.js'

describe('AllOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(allOf(equalTo('test'), contains('abc'))('abc').pass).toBeFalsy()
    expect(allOf(equalTo('test'), contains('test'))('test').pass).toBeTruthy()
  })
})
