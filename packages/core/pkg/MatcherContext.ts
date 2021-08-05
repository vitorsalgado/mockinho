import { Stub } from './Stub'
import { Context } from './Context'

export interface MatcherContext<
  S extends Stub<any, any, any, any> = any,
  C extends Context = any,
  R = any
> {
  stub: S
  context: C
  req: R
}
