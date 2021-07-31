export interface MatcherContext<Stub = any, Context = any, Request = any> {
  stub: Stub
  context: Context
  req: Request
}

export interface Matcher<Arg, Ctx = MatcherContext> {
  (arg: Arg, ctx: Ctx): boolean

  __matcher?: boolean
  id?: string
  context?: string
  key?: string
  expectation?: Array<unknown>
  value?: Arg
  matched?: boolean
}

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
