import { Matcher } from '@mockdog/core'

export const matches = (pattern: RegExp | string): Matcher<string> => {
  const regExp = new RegExp(pattern)

  return function matches(value): boolean {
    return regExp.test(value)
  }
}
