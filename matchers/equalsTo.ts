import assert from 'node:assert'
import { diff } from 'jest-diff'
import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const equalsTo =
  <T>(
    expected: T,
    ignoreCase: boolean = false,
    locale: string | string[] | undefined = undefined,
  ): Matcher<T> =>
  received => {
    const matcherName = 'equalTo'
    let pass: boolean

    if (typeof expected === 'string' && typeof received === 'string') {
      if (ignoreCase) {
        pass = expected.localeCompare(received, locale, { sensitivity: 'accent' }) === 0
      } else {
        pass = expected === received
      }
    } else {
      try {
        assert.deepStrictEqual(received, expected)
        pass = true
      } catch {
        pass = false
      }
    }

    return res(matcherName, () => matcherHint(matcherName) + '\n' + diff(expected, received), pass)
  }
