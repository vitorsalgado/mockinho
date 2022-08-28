import { noop } from '../_test.js'
import { equalsTo } from '../equalsTo.js'
import { item } from '../item.js'

describe('Item', function () {
  it('should apply a matcher only to the provided index of an array', function () {
    const arr = ['apple', 'orange', 'banana']
    const index = 1

    const result = item(index, equalsTo('orange'))(arr, noop())

    expect(result).toBeTruthy()
  })
})
