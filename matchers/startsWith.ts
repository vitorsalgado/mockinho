import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const startsWith = (expected: string): Matcher<string> => {
  return (received: string) => {
    const matcherName = 'startsWith'

    return res(
      matcherName,
      () =>
        matcherHint(matcherName) +
        '\n' +
        `Expected: ${printExpected(expected)}\n` +
        `Received: ${printReceived(received)}`,
      received.startsWith(expected),
    )
  }
}
