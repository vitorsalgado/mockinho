import { peek } from '../debug.js'
import { equalTo } from '../equalTo.js'

describe('peek', function () {
  it('should execute function with provided value', function () {
    const action = jest.fn()
    const result = peek(equalTo('test'), action)('test')

    expect(result.pass).toBeTruthy()
    expect(action).toHaveBeenCalledWith('test')
  })
})
