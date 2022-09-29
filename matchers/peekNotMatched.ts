import { Matcher } from './base/index.js'

export const peekNotMatched =
  <T>(matcher: Matcher<T>, action: (value: T) => void): Matcher<T> =>
  received => {
    const result = matcher(received)

    if (!result.pass) {
      action(received)
    }

    return result
  }
