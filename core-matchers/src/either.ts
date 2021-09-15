import { Matcher } from '@mockinho/core'

export const either = <T>(first: Matcher<T>, second: Matcher<T>): Matcher<T> =>
  function either(value): boolean {
    return first(value) || second(value)
  }
