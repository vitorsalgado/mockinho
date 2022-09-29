import { Matcher } from './base/index.js'
import { printReceived, indent, matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const either =
  <T>(first: Matcher<T>, second: Matcher<T>): Matcher<T> =>
  received => {
    const matcherName = 'either'
    const one = first(received)
    const other = second(received)

    const pass = one.pass || other.pass

    const msg = () => (!one.pass ? one.message() : other.message())

    return res(
      matcherName,
      () => matcherHint(matcherName) + `\nReceived: ${printReceived(received)}\n${indent(msg())}`,
      pass,
    )
  }
