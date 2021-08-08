import { Matcher } from '@mockinho/core'

export function trim(matcher: Matcher<string>): Matcher<string> {
  return function trim(value, ctx) {
    return matcher(value.trim(), ctx)
  }
}
