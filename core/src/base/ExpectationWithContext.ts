import { MatcherContextHolder } from './MatcherContextHolder'
import { BaseConfiguration } from './BaseConfiguration'
import { Mock } from './Mock'

export interface ExpectationWithContext<Value, ValueContext> {
  valueGetter: (ctx: ValueContext) => Value
  matcherContext: MatcherContextHolder<BaseConfiguration, Mock, any>
}
