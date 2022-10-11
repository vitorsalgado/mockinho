import { extractPath } from '../extractPath.js'

describe('extractPath', function () {
  describe('when path contains a querystring', function () {
    it('should remove the querystring and return only the path', function () {
      const url = '/test/dev?filter=dev'

      expect(extractPath(url)).toEqual('/test/dev')
    })
  })

  describe('when path does not contain a querystring', function () {
    it('should return path as is', function () {
      const url = '/test'

      expect(extractPath(url)).toEqual('/test')
    })
  })
})
