import { Express } from 'express'
import { createMatcher, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const fileEncoding = (
  matcher: Matcher<string> | string
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return createMatcher(
    'fileEncoding',

    (file, ctx): boolean => {
      if (!file) {
        return false
      }

      return actualMatcher(file.encoding, ctx)
    }
  )
}
