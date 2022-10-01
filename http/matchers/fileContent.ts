import { Express } from 'express'
import { equalsTo } from '@mockdog/matchers'
import { matcherHint, res } from '@mockdog/matchers/internal'
import { Matcher } from '@mockdog/matchers'

export const fileContent = (
  matcher: Matcher<string> | string,
  // eslint-disable-next-line no-undef
  encoding: BufferEncoding = 'utf8',
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return file => {
    if (!file || !file.buffer) {
      return res('fileContent', () => matcherHint('fileContent'), false)
    }

    return actualMatcher(file.buffer.toString(encoding))
  }
}
