import { Express } from 'express'
import { Matcher } from '@mockdog/core'
import { equalsTo } from '@mockdog/core-matchers'

export const fileMimeType = (
  matcher: Matcher<string> | string
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return function fileMimeType(file): boolean {
    if (!file) {
      return false
    }

    return actualMatcher(file.mimetype)
  }
}
