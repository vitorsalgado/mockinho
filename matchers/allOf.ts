import { Matcher } from './base.js'

export const allOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> =>
  function allOf(value): boolean {
    return expectations.every(x => x(value))
  }
