import { Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'
import { HttpRequest } from '../HttpRequest'

export const contentType = (expectation: Matcher<string> | string): Matcher<HttpRequest> => {
  const matcher = typeof expectation === 'string' ? equalsTo(expectation) : expectation

  return function contentType(request): boolean {
    return matcher(request.headers['content-type'])
  }
}
