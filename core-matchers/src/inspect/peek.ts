import { Matcher } from '@mockinho/core'

export function peek<T>(matcher: Matcher<T>, action: (value: T) => void): Matcher<T> {
  return function peek(value): boolean {
    action(value)

    return matcher(value)
  }
}
