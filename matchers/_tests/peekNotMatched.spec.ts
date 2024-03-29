import { peekNotMatched } from '../debug.js'
import { equalTo } from '../equalTo.js'

describe('peekNotMatched', function () {
  describe('when matcher evaluates to false', function () {
    it('should execute action', function () {
      const action = jest.fn()
      const matcher = equalTo('test')
      const result = peekNotMatched(matcher, action)('dev')

      expect(result.pass).toBeFalsy()
      expect(action).toHaveBeenCalledWith('dev')
    })
  })

  describe('when matcher evaluates to true', function () {
    it('should not execute action', function () {
      const action = jest.fn()
      const matcher = equalTo('test')
      const result = peekNotMatched(matcher, action)('test')

      expect(result.pass).toBeTruthy()
      expect(action).not.toHaveBeenCalled()
    })
  })
})
