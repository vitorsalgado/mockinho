import { Matcher } from '@mockdog/core'

export const both = <T>(first: Matcher<T>, second: Matcher<T>): Matcher<T> =>
  function both(value): boolean {
    return first(value) && second(value)
  }
