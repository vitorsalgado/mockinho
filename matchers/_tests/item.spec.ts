import { equalTo } from '../equalTo.js'
import { item } from '../item.js'

describe('Item', function () {
  it('should apply a matcher only to the provided index of an array', function () {
    const arr = ['apple', 'orange', 'banana']
    const index = 1

    const result = item(index, equalTo('orange'))(arr)

    expect(result.pass).toBeTruthy()
  })
})
