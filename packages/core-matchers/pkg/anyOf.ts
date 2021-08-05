import { Matcher, notEmpty } from '@mockinho/core'

export const anyOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return function anyOf(value, ctx): boolean {
    return expectations.some(x => x(value, ctx))
  }
}
