import { urlPathMatching } from '../urlPathMatching.js'

describe('URL Path Matching', function () {
  it('should apply regex pattern only to the url path segment', function () {
    const href = 'http://example.com.br/test?q=fruits#page'
    const pattern = /^\/test/

    const result = urlPathMatching(pattern)(href)

    expect(result.pass).toBeTruthy()
  })
})
