import { allOf } from '../allOf.js'
import { contains } from '../contains.js'
import { equalsTo } from '../equalsTo.js'

describe('AllOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(allOf(equalsTo('test'), contains('abc'))('abc').pass).toBeFalsy()
    expect(allOf(equalsTo('test'), contains('test'))('test').pass).toBeTruthy()
  })
})
