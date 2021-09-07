import { Express } from 'express'
import { Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const fileEncoding = (
  matcher: Matcher<string> | string
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return function fileEncoding(file): boolean {
    if (!file) {
      return false
    }

    return actualMatcher(file.encoding)
  }
}
