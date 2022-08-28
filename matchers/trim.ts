import { Matcher } from './base.js'

export function trim(matcher: Matcher<string>): Matcher<string> {
  return function trim(value, ctx) {
    return matcher(value.trim(), ctx)
  }
}
