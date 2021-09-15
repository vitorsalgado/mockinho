import { everyItem } from '..'
import { isPresent } from '..'
import { equalsTo } from '..'

describe('everyItem', function () {
  it('should return true when items matches', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(isPresent())(arr)

    expect(result).toBeTruthy()
  })

  it('should return false when any item does not match', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(equalsTo('avocado'))(arr)

    expect(result).toBeFalsy()
  })

  it('should return false when some items matches', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(equalsTo('apple'))(arr)

    expect(result).toBeFalsy()
  })
})
