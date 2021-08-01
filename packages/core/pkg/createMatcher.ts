import { Matcher } from './Matcher'

export function createMatcher<T, E>(
  id: string,
  matcher: Matcher<T>,
  ...expectation: Array<E>
): Matcher<T> {
  matcher.__matcher = true

  matcher.id = id
  matcher.expectation = expectation

  return matcher
}
