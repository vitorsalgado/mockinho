import { Matcher } from '@mockinho/core'

export const startsWith = (expected: string): Matcher<string> =>
  function startsWith(value: string): boolean {
    return value.startsWith(expected)
  }
