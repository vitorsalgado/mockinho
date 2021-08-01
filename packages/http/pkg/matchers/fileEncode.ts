import { Express } from 'express'
import { createMatcher, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const fileEncode = (
  matcher: Matcher<string> | string
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return createMatcher(
    'fileEncode',

    (file, ctx): boolean => {
      if (!file) {
        return false
      }

      return actualMatcher(file.encoding, ctx)
    }
  )
}
