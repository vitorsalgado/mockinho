import { MatcherContext } from './MatcherContext'

export interface Matcher<Arg, Ctx = MatcherContext> {
  __matcher?: boolean
  id?: string
  context?: string
  key?: string
  expectation?: Array<unknown>
  value?: Arg
  matched?: boolean

  (arg: Arg, ctx: Ctx): boolean
}
