import { peek } from '../peek'
import { equalsTo } from '../../equalsTo'

describe('peek', function () {
  it('should execute function with provided value', function () {
    const action = jest.fn()
    const result = peek(equalsTo('test'), action)('test')

    expect(result).toBeTruthy()
    expect(action).toHaveBeenCalledWith('test', undefined)
  })
})
