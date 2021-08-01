import { createMatcher, Matcher } from '@mockinho/core'

export const not = <T>(matcher: Matcher<T>): Matcher<T> =>
  createMatcher(
    'not',

    (value, ctx): boolean => !matcher(value, ctx)
  )
