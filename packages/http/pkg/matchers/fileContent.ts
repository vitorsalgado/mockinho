import { Express } from 'express'
import { createMatcher, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const fileContent = (
  matcher: Matcher<string> | string,
  // eslint-disable-next-line no-undef
  encoding: BufferEncoding = 'utf8'
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return createMatcher(
    'fileContent',

    (file, ctx): boolean => {
      if (!file || !file.buffer) {
        return false
      }

      return actualMatcher(file.buffer.toString(encoding), ctx)
    }
  )
}
