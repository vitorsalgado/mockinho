import { equalTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'
import { HttpRequest } from '../request.js'

export const contentType = (expectation: Matcher<string> | string): Matcher<HttpRequest> => {
  const matcher = typeof expectation === 'string' ? equalTo(expectation) : expectation

  return request => matcher(request.headers['content-type'])
}
