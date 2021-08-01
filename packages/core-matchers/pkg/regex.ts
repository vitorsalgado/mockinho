import { createMatcher, Matcher } from '@mockinho/core'

export const matching = (pattern: RegExp | string): Matcher<string> => {
  const regExp = new RegExp(pattern)

  return createMatcher(
    'matching',

    (value): boolean => {
      if (pattern instanceof RegExp) {
        return pattern.test(value)
      }

      return regExp.test(value)
    }
  )
}
