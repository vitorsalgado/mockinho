import { equalsTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'
import { HttpRequest } from '../HttpRequest.js'

export const contentType = (expectation: Matcher<string> | string): Matcher<HttpRequest> => {
  const matcher = typeof expectation === 'string' ? equalsTo(expectation) : expectation

  return request => matcher(request.headers['content-type'])
}
