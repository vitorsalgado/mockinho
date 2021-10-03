import { MatcherContextHolder } from './MatcherContextHolder'
import { Mock } from './Mock'
import { Configuration } from './Configuration'

export interface ExpectationWithContext<
  Value,
  ValueContext,
  MOCK extends Mock = Mock,
  CONFIG extends Configuration = Configuration
> {
  valueGetter: (ctx: ValueContext) => Value
  matcherContext: MatcherContextHolder<MOCK, CONFIG>
}
