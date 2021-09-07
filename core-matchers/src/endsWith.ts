import { Matcher } from '@mockinho/core'

export const endsWith = (expected: string): Matcher<string> =>
  function endsWith(value): boolean {
    return value.endsWith(expected)
  }
