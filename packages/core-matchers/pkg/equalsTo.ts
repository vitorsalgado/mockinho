import { createMatcher, Matcher } from '@mockinho/core'
import assert from 'assert'

export const equalsTo = <T>(
  expected: T,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined
): Matcher<T> =>
  createMatcher(
    'equalsTo',

    (value): boolean => {
      try {
        if (typeof expected === 'string' && typeof value === 'string') {
          if (ignoreCase) {
            return expected.localeCompare(value, locale, { sensitivity: 'accent' }) === 0
          }

          return expected === value
        }

        assert.deepStrictEqual(value, expected)
        return true
      } catch {}

      return false
    },
    expected
  )
