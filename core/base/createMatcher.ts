import { Matcher } from './Matcher.js'

export function createMatcher<T, E>(matcher: Matcher<T>, ...expectation: Array<E>): Matcher<T> {
  matcher.expectation = expectation

  return matcher
}
