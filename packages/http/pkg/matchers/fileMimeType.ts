import { Express } from 'express'
import { createMatcher, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const fileMimeType = (
  matcher: Matcher<string> | string
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return createMatcher(
    'fileMimeType',

    (file, ctx): boolean => {
      if (!file) {
        return false
      }

      return actualMatcher(file.mimetype, ctx)
    }
  )
}
