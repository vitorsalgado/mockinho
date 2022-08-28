import { Matcher } from './base.js'

export function peekNotMatched<T>(matcher: Matcher<T>, action: (value: T) => void): Matcher<T> {
  return function peekNotMatched(value, ctx): boolean {
    const result = matcher(value, ctx)

    if (!result) {
      action(value)
    }

    return result
  }
}
