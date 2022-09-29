import { Matcher } from './base/index.js'

export function trim(matcher: Matcher<string>): Matcher<string> {
  return function trim(value) {
    return matcher(value.trim())
  }
}
