import { Matcher } from './base.js'

export const not = <T>(matcher: Matcher<T>): Matcher<T> =>
  function not(value): boolean {
    return !matcher(value)
  }
