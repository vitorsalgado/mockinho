import { Matcher } from '@mockinho/core'
import { MatcherContext } from '@mockinho/core'

export function notMatched<T>(
  matcher: Matcher<T>,
  action: (matcher: Matcher<T>, value: T, ctx?: MatcherContext) => void
): Matcher<T> {
  return function notMatched(value, ctx): boolean {
    const result = matcher(value, ctx)

    if (!result) {
      action(matcher, value, ctx)
    }

    return result
  }
}
