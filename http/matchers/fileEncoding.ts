import { Express } from 'express'
import { equalsTo } from 'matchers'
import { Matcher } from '@mockdog/core'

export const fileEncoding = (
  matcher: Matcher<string> | string,
): Matcher<Express.Multer.File | undefined> => {
  const actualMatcher = typeof matcher === 'string' ? equalsTo(matcher) : matcher

  return function fileEncoding(file): boolean {
    if (!file) {
      return false
    }

    return actualMatcher(file.encoding)
  }
}
