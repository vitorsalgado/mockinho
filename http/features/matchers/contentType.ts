import { equalTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'
import { SrvRequest } from '../../request.js'

export const contentType = (expectation: Matcher<string> | string): Matcher<SrvRequest> => {
  const matcher = typeof expectation === 'string' ? equalTo(expectation) : expectation

  return request => matcher(request.headers['content-type'])
}
