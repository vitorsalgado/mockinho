import assert from 'assert'
import { Matcher } from './base.js'

export const equalsTo = <T>(
  expected: T,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined
): Matcher<T> =>
  function equalsTo(value: T): boolean {
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
  }
