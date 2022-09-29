import { Matcher } from './base/index.js'

export function toUpperCase(
  matcher: Matcher<string>,
  locales?: string | string[],
): Matcher<string> {
  return function toUpperCase(value) {
    return matcher(value.toLocaleUpperCase(locales))
  }
}
