import { createMatcher, Matcher } from './base'

export const startsWith = (expected: string): Matcher<string> =>
  createMatcher(
    'startsWith',

    (value: string): boolean => value.startsWith(expected)
  )
