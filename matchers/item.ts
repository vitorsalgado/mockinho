import { red } from 'colorette'
import { NullOrUndef } from '@mockdog/x'
import { Matcher } from './base/index.js'
import { indent, matcherHint, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const item =
  <T>(index: number, matcher: Matcher<T>): Matcher<NullOrUndef<Array<T>>> =>
  received => {
    const matcherName = 'item'

    if (typeof received === 'undefined' || received === null) {
      return res(
        matcherName,
        () =>
          matcherHint(matcherName, String(index)) +
          '\n' +
          `Item[${index}]: ${red('Received an undefined value')}`,
        false,
      )
    }

    const value = received[index]
    const result = matcher(value)

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, String(index)) +
        '\n' +
        `Item[${index}]: ${printReceived(value)}\n` +
        indent(result.message()),
      result.pass,
    )
  }
