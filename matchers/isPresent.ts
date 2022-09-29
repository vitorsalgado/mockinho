import { Matcher } from './base/index.js'
import { matcherHint, printReceived } from './internal/fmt.js'
import { res } from './internal/res.js'

export const isPresent =
  <T>(): Matcher<T> =>
  received => {
    const matcherName = 'isPresent'

    return res(
      matcherName,
      () => matcherHint(matcherName) + `Received: ${printReceived(received)}`,
      (() => {
        if (received === null || typeof received === 'undefined') return false
        if (typeof received === 'string' || Array.isArray(received))
          if (received.length === 0) return false

        return true
      })(),
    )
  }
