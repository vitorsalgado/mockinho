import { Matcher } from '@mockinho/core'

export const both = <T>(first: Matcher<T>, second: Matcher<T>): Matcher<T> =>
  function both(value): boolean {
    return first(value) && second(value)
  }
