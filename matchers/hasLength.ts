import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const hasLength =
  <T>(length: number): Matcher<Array<T> | string> =>
  value => {
    const matcherName = 'hasLength'
    return res(
      matcherName,
      () =>
        matcherHint(matcherName, String(length)) +
        `\nExpected: ${printExpected(length)}\nActual: ${printReceived(value.length)}`,
      value.length === length,
    )
  }
