import { peek } from '../debug.js'
import { equalsTo } from '../equalsTo.js'

describe('peek', function () {
  it('should execute function with provided value', function () {
    const action = jest.fn()
    const result = peek(equalsTo('test'), action)('test')

    expect(result.pass).toBeTruthy()
    expect(action).toHaveBeenCalledWith('test')
  })
})
