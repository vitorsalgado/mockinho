import { Matcher } from '@mockinho/core'

export const matching = (pattern: RegExp | string): Matcher<string> => {
  const regExp = new RegExp(pattern)

  return function matching(value): boolean {
    return regExp.test(value)
  }
}
