import { notMatched } from '../notMatched'
import { equalsTo } from '../../equalsTo'

describe('notMatched', function () {
  describe('when matcher evaluates to false', function () {
    it('should execute action', function () {
      const action = jest.fn()
      const matcher = equalsTo('test')
      const result = notMatched(matcher, action)('dev')

      expect(result).toBeFalsy()
      expect(action).toHaveBeenCalledWith(matcher, 'dev', undefined)
    })
  })

  describe('when matcher evaluates to true', function () {
    it('should not execute action', function () {
      const action = jest.fn()
      const matcher = equalsTo('test')
      const result = notMatched(matcher, action)('test')

      expect(result).toBeTruthy()
      expect(action).not.toHaveBeenCalled()
    })
  })
})
