import { Matcher } from '@mockinho/core'

export const endsWith = (expected: string): Matcher<string> => {
  return function endsWith(value): boolean {
    return value.endsWith(expected)
  }
}
