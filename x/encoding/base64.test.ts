import { base64 } from './base64.js'

describe('Encoding', function () {
  describe('Base64', function () {
    it('should encode a string value', function () {
      const val = 'test-123456'
      const expected = 'dGVzdC0xMjM0NTY='

      const encoded = base64.encode(val)
      const decoded = base64.decode(encoded)

      expect(encoded).toEqual(expected)
      expect(decoded).toEqual(val)
    })
  })
})
