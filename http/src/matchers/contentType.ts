import { Matcher } from '@mockdog/core'
import { equalsTo } from '@mockdog/core-matchers'
import { HttpRequest } from '../HttpRequest.js'

export const contentType = (expectation: Matcher<string> | string): Matcher<HttpRequest> => {
  const matcher = typeof expectation === 'string' ? equalsTo(expectation) : expectation

  return function contentType(request): boolean {
    return matcher(request.headers['content-type'])
  }
}
