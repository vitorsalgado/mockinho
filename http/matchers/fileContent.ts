import { Express } from 'express'
import { Matcher } from '@mockdog/core'
import { equalsTo } from '@mockdog/matchers'

export const fileContent = (
  matcher: Matcher<string> | string,
  // eslint-disable-next-line no-undef
  encoding: BufferEncoding = 'utf8'
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return function fileContent(file): boolean {
    if (!file || !file.buffer) {
      return false
    }

    return actualMatcher(file.buffer.toString(encoding))
  }
}
