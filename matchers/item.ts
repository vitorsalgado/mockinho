import { Matcher } from './base/index.js'
import { indent, matcherHint, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const item =
  <T>(index: number, matcher: Matcher<T>): Matcher<Array<T>> =>
  value => {
    const matcherName = 'item'
    const val = value[index]
    const result = matcher(value[index])

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
