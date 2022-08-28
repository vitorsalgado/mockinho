import { Matcher } from './base.js'

export function toUpperCase(
  matcher: Matcher<string>,
  locales?: string | string[]
): Matcher<string> {
  return function toUpperCase(value, ctx) {
    return matcher(value.toLocaleUpperCase(locales), ctx)
  }
}
