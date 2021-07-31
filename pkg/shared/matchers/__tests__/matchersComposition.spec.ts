import { equalsTo } from '../equalsTo'
import { item } from '../item'
import { jsonPath } from '../jsonPath'
import { not } from '../not'
import { fakeMatcherContext } from './testUtils'

describe('Matchers Composition', function () {
  it('should compose jsonPath with item to match against an array property', function () {
    const obj = { test: { inner: { data: ['apple', 'orange', 'banana'] } } }
    const path = 'test.inner.data'
    const expected = 'banana'

    const matcher = jsonPath(path, item(2, equalsTo(expected)))
    const result = matcher(obj, fakeMatcherContext())
    const neg = not(matcher)(obj, fakeMatcherContext())

    expect(result).toBeTruthy()
    expect(neg).toBeFalsy()
  })
})
