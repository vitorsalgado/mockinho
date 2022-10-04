import { Matcher } from '@mockdog/matchers'
import { HttpRequest } from '../request.js'

export const accept =
  (matcher: Matcher<string>): Matcher<HttpRequest> =>
  received =>
    matcher(received.headers.accept)
