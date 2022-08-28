import { MatcherContextHolder } from './MatcherContextHolder.js'
import { Mock } from './Mock.js'
import { Configuration } from './Configuration.js'

export interface ExpectationWithContext<
  Value,
  ValueContext,
  MOCK extends Mock = Mock,
  CONFIG extends Configuration = Configuration,
> {
  valueGetter: (ctx: ValueContext) => Value
  matcherContext: MatcherContextHolder<MOCK, CONFIG>
}
