import { Matcher } from './base.js'

export const is = <T>(matcher: Matcher<T>): Matcher<T> =>
  function is(value, ctx): boolean {
    return matcher(value, ctx)
  }
