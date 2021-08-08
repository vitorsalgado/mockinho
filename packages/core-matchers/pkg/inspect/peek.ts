import { Matcher } from '@mockinho/core'
import { MatcherContext } from '@mockinho/core'

export function peek<T>(
  matcher: Matcher<T>,
  action: (value: T, ctx?: MatcherContext) => void
): Matcher<T> {
  return function peek(value, ctx): boolean {
    action(value, ctx)

    return matcher(value, ctx)
  }
}
