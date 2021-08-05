import { MatcherContext } from './MatcherContext'

export interface Matcher<Arg, Ctx extends MatcherContext = MatcherContext> {
  id?: string
  expectation?: Array<unknown>

  (arg: Arg, ctx?: Ctx): boolean
}
