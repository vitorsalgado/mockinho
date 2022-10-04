import { bold } from 'colorette'
import { Matcher } from './base/index.js'
import { matcherHint, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const not =
  <T>(matcher: Matcher<T>): Matcher<T> =>
  received => {
    const matcherName = 'not'
    const r = matcher(received)

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, r.name) +
        '\n' +
        `Matcher ${bold(r.name)} passed when it ${bold("shouldn't")}\n` +
        `Received: ${printReceived(received)}`,
      !matcher(received).pass,
    )
  }
