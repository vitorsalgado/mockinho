import { createMatcher, Matcher } from './base'

export const endsWith = (expected: string): Matcher<string> =>
  createMatcher(
    'endsWith',

    (value): boolean => value.endsWith(expected)
  )
