import { HttpRequest } from '../../../http/HttpRequest'
import { createMatcher, Matcher } from '../base'
import { equalsTo } from '../equalsTo'

export const contentType = (matcher: Matcher<string> | string): Matcher<HttpRequest> => {
  const m = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return createMatcher(
    'contentType',

    (request, ctx): boolean => m(request.headers['content-type'], ctx)
  )
}
