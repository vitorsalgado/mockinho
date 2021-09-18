import { BaseConfiguration } from './BaseConfiguration'
import { Mock } from './Mock'
import { MockRepository } from './MockRepository'
import { Matcher } from './Matcher'
import { Context } from './Context'

export interface MatcherContextHolder<C extends BaseConfiguration, M extends Mock, A = void> {
  (ctx: Context<C, M, MockRepository<M>>, mock: M): Matcher<A>
}
