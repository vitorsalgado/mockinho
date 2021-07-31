import { createMatcher, Matcher } from './base'

export const hitTimes = (times: number): Matcher<unknown> =>
  createMatcher(
    'hitTimes',

    (value, ctx): boolean => ctx.stub.totalHits() <= times
  )
