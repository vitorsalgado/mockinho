import { notEmpty } from '../../../internal/preconditions/notEmpty'
import { createMatcher, Matcher } from './base'

export const allOf = <T>(...expectations: Array<Matcher<T>>): Matcher<T> => {
  notEmpty(expectations)

  return createMatcher(
    'allOf',

    (value, ctx): boolean => expectations.every(x => x(value, ctx))
  )
}
