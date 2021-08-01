import { createMatcher, Matcher } from '@mockinho/core'

export const endsWith = (expected: string): Matcher<string> =>
  createMatcher(
    'endsWith',

    (value): boolean => value.endsWith(expected)
  )
