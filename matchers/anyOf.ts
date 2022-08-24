import { Matcher } from './base.js'

export const anyOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> =>
  function anyOf(value): boolean {
    return expectations.some(x => x(value))
  }
