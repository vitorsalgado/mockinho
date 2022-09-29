import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const everyItem =
  <T>(matcher: Matcher<T>): Matcher<Array<T>> =>
  value => {
    const matcherName = 'everyItem'
    return res(
      matcherName,
      () => matcherHint(matcherName),
      value.every(item => matcher(item).pass),
    )
  }
