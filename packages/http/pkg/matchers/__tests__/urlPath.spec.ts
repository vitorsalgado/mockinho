import { fakeMatcherContext } from '@mockinho/core-matchers'
import { urlPath } from '../urlPath'

describe('URL Path', function () {
  it('should return true when provided value is equal to the url path segment only', function () {
    const path = '/test'
    const href = 'http://example.com.br/test?q=fruits#page'

    const matcher = urlPath(path)

    expect(matcher(href, fakeMatcherContext())).toBeTruthy()
    expect(
      matcher('http://example.com.br/test/another-route?q=fruits#page', fakeMatcherContext())
    ).toBeFalsy()
  })

  it('should be case sensitive by default', function () {
    const path = '/test'
    const href = 'http://example.com.br/TEST?q=fruits#page'

    const result = urlPath(path)(href, fakeMatcherContext())

    expect(result).toBeFalsy()
  })

  it('should ignore case when parameter ignoreCase is true', function () {
    const path = '/test'
    const href = 'http://example.com.br/TEST?q=fruits#page'

    const result = urlPath(path, true)(href, fakeMatcherContext())

    expect(result).toBeTruthy()
  })
})
