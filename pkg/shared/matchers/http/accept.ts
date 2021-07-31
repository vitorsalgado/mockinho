import { HttpRequest } from '../../../http/HttpRequest'
import { createMatcher, Matcher } from '../base'

export const accept = (matcher: Matcher<string>): Matcher<HttpRequest> =>
  createMatcher(
    'accept',

    (request, ctx): boolean => matcher(request.headers.accept, ctx)
  )
