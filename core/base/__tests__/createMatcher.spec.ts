import { createMatcher } from '../index.js'

describe('createMatcher', function () {
  describe('when create matcher function with createMatcher', function () {
    it('should produce a function with metadata', function () {
      const expectation = 'test'
      const matcher = createMatcher(function fn(value: string): boolean {
        return value === expectation
      }, expectation)

      expect(matcher.expectation).toEqual([expectation])
      expect(matcher.name).toEqual('fn')
      expect(matcher('test')).toBeTruthy()
      expect(matcher('dev')).toBeFalsy()
    })
  })
})
