import { Matcher } from '@mockdog/core'

export function peekNotMatched<T>(matcher: Matcher<T>, action: (value: T) => void): Matcher<T> {
  return function peekNotMatched(value): boolean {
    const result = matcher(value)

    if (!result) {
      action(value)
    }

    return result
  }
}
