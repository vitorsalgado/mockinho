import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const both =
  <T>(first: Matcher<T>, second: Matcher<T>): Matcher<T> =>
  received => {
    const matcherName = 'both'
    const one = first(received)
    const other = second(received)

    const pass = one.pass && other.pass

    return res(
      'both',
      () =>
        matcherHint(matcherName) + '\nFirst: \n' + one.message() + '\nSecond: \n' + other.message(),
      pass,
    )
  }
