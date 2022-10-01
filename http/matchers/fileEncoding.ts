import { Express } from 'express'
import { equalsTo, Matcher, matcherHint, res } from '@mockdog/matchers'

export const fileEncoding = (
  matcher: Matcher<string> | string,
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return file => {
    if (!file) {
      return res('fileEncoding', () => matcherHint('fileEncoding'), false)
    }

    return actualMatcher(file.encoding)
  }
}
