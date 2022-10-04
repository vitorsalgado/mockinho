import { NullOrUndef } from '@mockdog/x'
import { Matcher } from './base/index.js'
import { equalTo } from './equalTo.js'
import { printExpected, printReceived, matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const contains =
  (expected: string): Matcher<NullOrUndef<string | string[]>> =>
  received => {
    const matcherName = 'contains'
    const pass = Array.isArray(received)
      ? received.some(x => equalTo(expected)(x).pass)
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
