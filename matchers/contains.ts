import { Matcher } from './base/index.js'
import { equalsTo } from './equalsTo.js'
import { printExpected, printReceived, matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const contains =
  (expected: string): Matcher<string | string[]> =>
  received => {
    const matcherName = 'contains'
    const pass = Array.isArray(received)
      ? received.some(x => equalsTo(expected)(x).pass)
      : String(received).includes(expected)

    return res(
      matcherName,
      () =>
        matcherHint(matcherName) +
        '\n' +
        `Expected value: ${printExpected(expected)}\n` +
        `Received: ${printReceived(received)}`,
      pass,
    )
  }
