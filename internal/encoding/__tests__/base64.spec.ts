import { decodeBase64, encodeBase64 } from '../base64'

describe('Encoding', function () {
  describe('Base64', function () {
    it('should encode a string value', function () {
      const val = 'test-123456'
      const expected = 'dGVzdC0xMjM0NTY='

      const encoded = encodeBase64(val)
      const decoded = decodeBase64(encoded)

      expect(encoded).toEqual(expected)
      expect(decoded).toEqual(val)
    })
  })
})
