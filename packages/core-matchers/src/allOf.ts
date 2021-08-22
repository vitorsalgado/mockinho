import { Matcher, notEmpty } from '@mockinho/core'

export const allOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return function allOf(value): boolean {
    return expectations.every(x => x(value))
  }
}
