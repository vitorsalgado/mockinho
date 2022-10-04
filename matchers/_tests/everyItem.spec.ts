import { everyItem } from '../index.js'
import { isPresent } from '../index.js'
import { equalTo } from '../index.js'

describe('everyItem', function () {
  it('should return true when items matches', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(isPresent())(arr)

    expect(result.pass).toBeTruthy()
  })

  it('should return false when any item does not match', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(equalTo('avocado'))(arr)

    expect(result.pass).toBeFalsy()
  })

  it('should return false when some items matches', function () {
    const arr = ['apple', 'orange', 'banana']

    const result = everyItem(equalTo('apple'))(arr)

    expect(result.pass).toBeFalsy()
  })
})
