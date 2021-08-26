import { Configuration } from './Configuration'
import { Mock } from './Mock'
import { MockRepository } from './MockRepository'
import { Matcher } from './Matcher'
import { Context } from './Context'

export interface StatefulMatcher<C extends Configuration, M extends Mock> {
  (ctx: Context<C, M, MockRepository<M>>, mock: M): Matcher
}
