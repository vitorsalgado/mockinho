import { Matcher } from '@mockdog/core'

export const not = <T>(matcher: Matcher<T>): Matcher<T> =>
  function not(value): boolean {
    return !matcher(value)
  }
