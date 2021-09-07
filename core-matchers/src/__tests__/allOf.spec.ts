import { allOf } from '../allOf'
import { containing } from '../containing'
import { equalsTo } from '../equalsTo'

describe('AllOf', function () {
  it('should return true if anu of the provided matchers returns true too', function () {
    expect(allOf(equalsTo('test'), containing('abc'))('abc')).toBeFalsy()
    expect(allOf(equalsTo('test'), containing('test'))('test')).toBeTruthy()
  })
})
