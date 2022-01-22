import { equalsTo } from '../equalsTo'
import { item } from '../item'
import { jsonPath } from '../jsonPath'
import { not } from '../not'

describe('Matchers Composition', function () {
  it('should compose jsonPath with item to match against an array property', function () {
    const obj = { test: { inner: { data: ['apple', 'orange', 'banana'] } } }
    const path = 'test.inner.data'
    const expected = 'banana'

    const matcher = jsonPath(path, item(2, equalsTo(expected)))
    const result = matcher(obj)
    const neg = not(matcher)(obj)

    expect(result).toBeTruthy()
    expect(neg).toBeFalsy()
  })
})
