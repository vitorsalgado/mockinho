import { Matcher } from '@mockinho/core'

export function upperCase(matcher: Matcher<string>, locales?: string | string[]): Matcher<string> {
  return function upperCase(value, ctx) {
    return matcher(value.toLocaleUpperCase(locales), ctx)
  }
}
