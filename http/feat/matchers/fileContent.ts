import { Express } from 'express'
import { equalTo, matcherHint, res } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'

export const fileContent = (
  matcher: Matcher<string> | string,
  encoding: BufferEncoding = 'utf8',
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalTo(matcher) : matcher

  return file => {
    if (!file || !file.buffer) {
      return res('fileContent', () => matcherHint('fileContent'), false)
    }

    return actualMatcher(file.buffer.toString(encoding))
  }
}
