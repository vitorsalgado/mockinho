import { notEmpty } from '../../../internal/preconditions/notEmpty'
import { createMatcher, Matcher } from './base'

export const anyOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return createMatcher(
    'anyOf',

    (value, ctx): boolean => expectations.some(x => x(value, ctx))
  )
}
