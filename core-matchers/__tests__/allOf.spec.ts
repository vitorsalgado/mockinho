import { allOf } from '../allOf'
import { contains } from '../contains'
import { equalsTo } from '../equalsTo'

describe('AllOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(allOf(equalsTo('test'), contains('abc'))('abc')).toBeFalsy()
    expect(allOf(equalsTo('test'), contains('test'))('test')).toBeTruthy()
  })
})
