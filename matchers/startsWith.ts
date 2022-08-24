import { Matcher } from './base.js'

export const startsWith = (expected: string): Matcher<string> =>
  function startsWith(value: string): boolean {
    return value.startsWith(expected)
  }
