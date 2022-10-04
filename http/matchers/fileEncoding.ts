import { Express } from 'express'
import { equalTo, Matcher, matcherHint, res } from '@mockdog/matchers'

export const fileEncoding = (
  matcher: Matcher<string> | string,
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalTo(matcher) : matcher

  return file => {
    if (!file) {
      return res('fileEncoding', () => matcherHint('fileEncoding'), false)
    }

    return actualMatcher(file.encoding)
  }
}
