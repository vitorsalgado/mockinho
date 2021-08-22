import { Matcher } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'

export interface RecordFilter<Value> {
  valueGetter: (ctx: HttpRequest) => Value
  matcher: Matcher<Value>
}
