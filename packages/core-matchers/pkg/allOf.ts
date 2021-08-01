import { createMatcher, Matcher, notEmpty } from '@mockinho/core'

export const allOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return createMatcher(
    'allOf',

    (value, ctx): boolean => expectations.every(x => x(value, ctx))
  )
}
