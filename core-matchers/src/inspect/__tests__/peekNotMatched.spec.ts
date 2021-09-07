import { peekNotMatched } from '../peekNotMatched'
import { equalsTo } from '../../equalsTo'

describe('peekNotMatched', function () {
  describe('when matcher evaluates to false', function () {
    it('should execute action', function () {
      const action = jest.fn()
      const matcher = equalsTo('test')
      const result = peekNotMatched(matcher, action)('dev')

      expect(result).toBeFalsy()
      expect(action).toHaveBeenCalledWith('dev')
    })
  })

  describe('when matcher evaluates to true', function () {
    it('should not execute action', function () {
      const action = jest.fn()
      const matcher = equalsTo('test')
      const result = peekNotMatched(matcher, action)('test')

      expect(result).toBeTruthy()
      expect(action).not.toHaveBeenCalled()
    })
  })
})
