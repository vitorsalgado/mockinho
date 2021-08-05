import { urlPathMatching } from '../urlPathMatching'
import { testHttpMatcherContext } from '../../testUtils'

describe('URL Path Matching', function () {
  it('should apply regex pattern only to the url path segment', function () {
    const href = 'http://example.com.br/test?q=fruits#page'
    const pattern = /^\/test/

    const result = urlPathMatching(pattern)(href, testHttpMatcherContext())

    expect(result).toBeTruthy()
  })
})
