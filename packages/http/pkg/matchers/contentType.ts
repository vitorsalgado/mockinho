import { createMatcher, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'
import { HttpRequest } from '../HttpRequest'

export const contentType = (matcher: Matcher<string> | string): Matcher<HttpRequest> => {
  const m = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return createMatcher(
    'contentType',

    (request, ctx): boolean => m(request.headers['content-type'], ctx)
  )
}
