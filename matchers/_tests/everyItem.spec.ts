import { noop } from '../_test.js'
import { everyItem } from '../index.js'
import { isPresent } from '../index.js'
import { equalsTo } from '../index.js'

describe('everyItem', function () {
  it('should return true when items matches', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(isPresent())(arr, noop())

    expect(result).toBeTruthy()
  })

  it('should return false when any item does not match', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(equalsTo('avocado'))(arr, noop())

    expect(result).toBeFalsy()
  })

  it('should return false when some items matches', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(equalsTo('apple'))(arr, noop())

    expect(result).toBeFalsy()
  })
})
