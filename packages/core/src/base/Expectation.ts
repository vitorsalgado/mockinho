import { Matcher } from './Matcher'

export interface Expectation<Value, ValueContext> {
  valueGetter: (ctx: ValueContext) => Value
  matcher: Matcher<Value>
  weight: number
}
