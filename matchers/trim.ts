import { Matcher } from './base.js'

export function trim(matcher: Matcher<string>): Matcher<string> {
  return function trim(value) {
    return matcher(value.trim())
  }
}
