import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const endsWith =
  (expected: string): Matcher<string> =>
  received => {
    const matcherName = 'endsWith'

    return res(
      matcherName,
      () =>
        matcherHint(matcherName) +
        '\n' +
        `Expected: ${printExpected(expected)}\n` +
        `Received: ${printReceived(received)}`,
      received.endsWith(expected),
    )
  }
