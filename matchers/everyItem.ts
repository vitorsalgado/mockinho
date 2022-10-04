import { NullOrUndef } from '@mockdog/x'
import { Matcher } from './base/index.js'
import { matcherHint, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const everyItem =
  <T>(matcher: Matcher<T>): Matcher<NullOrUndef<Array<T>>> =>
  value => {
    const matcherName = 'everyItem'

    if (value === null || typeof value === 'undefined') {
      return res(
        matcherName,
        () => matcherHint(matcherName) + '\n' + printReceived('Value is null or undefined'),
        false,
      )
    }

    return res(
      matcherName,
      () => matcherHint(matcherName),
      value.every(item => matcher(item).pass),
    )
  }
