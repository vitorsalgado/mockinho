import { Mock } from './Mock'
import { MockRepository } from './MockRepository'
import { Matcher } from './Matcher'
import { Context } from './Context'
import { Configuration } from './Configuration'

export interface MatcherContextHolder<MOCK extends Mock, CONFIG extends Configuration, ARG = void> {
  (ctx: Context<MOCK, CONFIG, MockRepository<MOCK>>, mock: MOCK): Matcher<ARG>
}
