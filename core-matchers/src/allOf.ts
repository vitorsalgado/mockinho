import { Matcher, notEmpty } from '@mockdog/core'

export const allOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return function allOf(value): boolean {
    return expectations.every(x => x(value))
  }
}
