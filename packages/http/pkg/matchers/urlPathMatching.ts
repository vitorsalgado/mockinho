import { URL } from 'url'
import { Matcher } from '@mockinho/core'
import { matching } from '@mockinho/core-matchers'

export const urlPathMatching = (pattern: RegExp): Matcher<string> => {
  return function urlPathMapping(value, ctx): boolean {
    if (ctx) {
      ctx.stub.meta.set('url', pattern)
      ctx.context.provideStubRepository().save(ctx.stub)
    }

    return matching(pattern)(new URL(value).pathname, ctx)
  }
}
