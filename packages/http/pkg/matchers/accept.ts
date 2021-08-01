import { createMatcher, Matcher } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'

export const accept = (matcher: Matcher<string>): Matcher<HttpRequest> =>
  createMatcher(
    'accept',

    (request, ctx): boolean => matcher(request.headers.accept, ctx)
  )
