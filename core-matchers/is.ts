import { Matcher } from '@mockdog/core'

export const is = <T>(matcher: Matcher<T>): Matcher<T> =>
  function is(value): boolean {
    return matcher(value)
  }
