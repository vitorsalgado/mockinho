import { Mock } from './Mock.js'
import { MockRepository } from './MockRepository.js'
import { Matcher } from './Matcher.js'
import { Context } from './Context.js'
import { Configuration } from './Configuration.js'

export interface MatcherContextHolder<MOCK extends Mock, CONFIG extends Configuration, ARG = void> {
  (ctx: Context<MOCK, CONFIG, MockRepository<MOCK>>, mock: MOCK): Matcher<ARG>
}
