import { Express } from 'express'
import { Matcher } from '@mockdog/core'
import { equalsTo } from '@mockdog/matchers'

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
