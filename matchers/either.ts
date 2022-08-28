import { Matcher } from './base.js'

export const either = <T>(first: Matcher<T>, second: Matcher<T>): Matcher<T> =>
  function either(value, ctx): boolean {
    return first(value, ctx) || second(value, ctx)
  }
