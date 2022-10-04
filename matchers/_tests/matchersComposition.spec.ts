import { equalTo } from '../equalTo.js'
import { item } from '../item.js'
import { field } from '../field.js'
import { not } from '../not.js'

describe('Matchers Composition', function () {
  const obj = { test: { inner: { data: ['apple', 'orange', 'banana'], message: 'hey' } } }

  it('should compose jsonPath with item to match against an array property', function () {
    const path = 'test.inner.data'
    const expected = 'banana'

    const matcher = field(path, item(2, equalTo(expected)))
    const result = matcher(obj)
    const neg = not(matcher)(obj)

    expect(result.pass).toBeTruthy()
    expect(neg.pass).toBeFalsy()
  })
})
