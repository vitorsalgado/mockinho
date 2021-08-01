import { equalsTo } from '../equalsTo'
import { item } from '../item'
import { fakeMatcherContext } from '../testUtils'

describe('Item', function () {
  it('should apply a matcher only to the provided index of an array', function () {
    const arr = ['apple', 'orange', 'banana']
    const index = 1

    const result = item(index, equalsTo('orange'))(arr, fakeMatcherContext())

    expect(result).toBeTruthy()
  })
})
