import { NullOrUndef } from '@mockdog/x'
import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const hasLength =
  <T>(length: number): Matcher<NullOrUndef<Array<T> | string>> =>
  value => {
    const matcherName = 'hasLength'

    if (typeof value === 'undefined' || value === null) {
      return res(
        matcherName,
        () =>
          matcherHint(matcherName, String(length)) +
          `\nExpected: ${printExpected(length)}\nActual: ${printReceived(
            'received an null/undefined value',
          )}`,
        false,
      )
    }

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, String(length)) +
        `\nExpected: ${printExpected(length)}\nActual: ${printReceived(value.length)}`,
      value.length === length,
    )
  }
