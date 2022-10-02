import { red } from 'colorette'
import { Matcher } from './base/index.js'
import { indent, matcherHint, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const item =
  <T>(index: number, matcher: Matcher<T>): Matcher<Array<T>> =>
  value => {
    const matcherName = 'item'

    if (typeof value === 'undefined' || value === null) {
      return res(
        matcherName,
        () =>
          matcherHint(matcherName, String(index)) +
          '\n' +
          `Item[${index}]: ${red('Received an undefined value')}`,
        false,
      )
    }

    const val = value[index]
    const result = matcher(val)

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, String(index)) +
        '\n' +
        `Item[${index}]: ${printReceived(val)}\n` +
        indent(result.message()),
      result.pass,
    )
  }
