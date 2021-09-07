import { StatefulMatcher } from './StatefulMatcher'
import { BaseConfiguration } from './BaseConfiguration'
import { Mock } from './Mock'

export interface StatefulExpectation<Value, ValueContext> {
  valueGetter: (ctx: ValueContext) => Value
  matcher: StatefulMatcher<BaseConfiguration, Mock>
}
