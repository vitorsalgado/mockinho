import { Matcher } from '@mockinho/core'

export function toLowerCase(
  matcher: Matcher<string>,
  locales?: string | string[]
): Matcher<string> {
  return function toLowerCase(value) {
    return matcher(value.toLocaleLowerCase(locales))
  }
}