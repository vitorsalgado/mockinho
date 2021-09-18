import { Matcher, notEmpty } from '@mockdog/core'

export const anyOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return function anyOf(value): boolean {
    return expectations.some(x => x(value))
  }
}
