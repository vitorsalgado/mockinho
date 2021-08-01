import { createMatcher, Matcher } from '@mockinho/core'

export const hitTimes = (times: number): Matcher<unknown> =>
  createMatcher(
    'hitTimes',

    (value, ctx): boolean => ctx.stub.totalHits() <= times
  )
