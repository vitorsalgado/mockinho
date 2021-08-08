import { Matcher } from '@mockinho/core'

export function lowerCase(matcher: Matcher<string>, locales?: string | string[]): Matcher<string> {
  return function lowerCase(value, ctx) {
    return matcher(value.toLocaleLowerCase(locales), ctx)
  }
}
