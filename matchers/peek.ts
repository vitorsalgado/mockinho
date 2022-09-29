import { Matcher } from './base/index.js'

export const peek =
  <T>(matcher: Matcher<T>, action: (value: T) => void): Matcher<T> =>
  received => {
    action(received)

    return matcher(received)
  }
