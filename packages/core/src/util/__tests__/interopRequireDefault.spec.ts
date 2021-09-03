import { interopRequireDefault } from '../interopRequireDefault'

describe('interopRequireDefault', function () {
  describe('when parameter is undefined', function () {
    it('should return object with inner property named default', function () {
      const result = interopRequireDefault(undefined)

      expect(result.default).toBeUndefined()
    })
  })

  describe('when parameter contains a property __esModule', function () {
    it('should return parameter itself', function () {
      const result = interopRequireDefault({ __esModule: { test: 'hello' } })

      expect(result).toEqual({ __esModule: { test: 'hello' } })
    })
  })
})
