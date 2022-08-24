import { Matcher } from './base.js'

export const endsWith = (expected: string): Matcher<string> =>
  function endsWith(value): boolean {
    return value.endsWith(expected)
  }
