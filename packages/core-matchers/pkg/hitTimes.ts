import { Matcher } from '@mockinho/core'

export const hitTimes = (times: number): Matcher<unknown> => {
  return function hitTimes(value, ctx): boolean {
    if (!ctx) {
      throw new ReferenceError('Context is required on "Hit Times Matcher"')
    }

    return ctx.stub.totalHits() <= times
  }
}
