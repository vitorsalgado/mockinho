import { StatefulMatcher } from './StatefulMatcher'
import { Configuration } from './Configuration'
import { Mock } from './Mock'

export interface StatefulExpectation<Value, ValueContext> {
  valueGetter: (ctx: ValueContext) => Value
  matcher: StatefulMatcher<Configuration, Mock>
}
