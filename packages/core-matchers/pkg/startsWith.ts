import { createMatcher, Matcher } from '@mockinho/core'

export const startsWith = (expected: string): Matcher<string> =>
  createMatcher(
    'startsWith',

    (value: string): boolean => value.startsWith(expected)
  )
