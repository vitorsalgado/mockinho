import { createMatcher, Matcher, notEmpty } from '@mockinho/core'

export const anyOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return createMatcher(
    'anyOf',

    (value, ctx): boolean => expectations.some(x => x(value, ctx))
  )
}
