import { Matcher } from '@mockinho/core'

export const startsWith = (expected: string): Matcher<string> => {
  return function startsWith(value: string): boolean {
    return value.startsWith(expected)
  }
}
