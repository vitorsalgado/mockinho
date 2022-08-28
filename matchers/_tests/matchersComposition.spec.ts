import { noop } from '../_test.js'
import { equalsTo } from '../equalsTo.js'
import { item } from '../item.js'
import { jsonPath } from '../jsonPath.js'
import { not } from '../not.js'

describe('Matchers Composition', function () {
  it('should compose jsonPath with item to match against an array property', function () {
    const obj = { test: { inner: { data: ['apple', 'orange', 'banana'] } } }
    const path = 'test.inner.data'
    const expected = 'banana'

    const matcher = jsonPath(path, item(2, equalsTo(expected)))
    const result = matcher(obj, noop())
    const neg = not(matcher)(obj, noop())

    expect(result).toBeTruthy()
    expect(neg).toBeFalsy()
  })
})
