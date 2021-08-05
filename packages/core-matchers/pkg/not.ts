import { Matcher } from '@mockinho/core'

export const not = <T>(matcher: Matcher<T>): Matcher<T> => {
  return function not(value, ctx): boolean {
    return !matcher(value, ctx)
  }
}
