import { Matcher } from '@mockdog/matchers'
import { SrvRequest } from '../../request.js'

export const accept =
  (matcher: Matcher<string>): Matcher<SrvRequest> =>
  received =>
    matcher(received.headers.accept)
