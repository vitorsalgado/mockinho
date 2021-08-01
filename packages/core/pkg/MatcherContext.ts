export interface MatcherContext<Stub = any, Context = any, Request = any> {
  stub: Stub
  context: Context
  req: Request
}
