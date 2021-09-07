import { BaseConfiguration } from './BaseConfiguration'
import { Mock } from './Mock'
import { MockRepository } from './MockRepository'
import { Matcher } from './Matcher'
import { Context } from './Context'

export interface StatefulMatcher<C extends BaseConfiguration, M extends Mock> {
  (ctx: Context<C, M, MockRepository<M>>, mock: M): Matcher
}
