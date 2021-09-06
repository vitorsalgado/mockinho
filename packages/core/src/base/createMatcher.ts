import { Matcher } from './Matcher'

export function createMatcher<T, E>(matcher: Matcher<T>, ...expectation: Array<E>): Matcher<T> {
  matcher.expectation = expectation

  return matcher
}
