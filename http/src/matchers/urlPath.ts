import { URL } from 'url'
import { Matcher } from '@mockinho/core'
import { createMatcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const urlPath = (
  path: string,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined
): Matcher<string> =>
  createMatcher(function urlPath(value): boolean {
    return equalsTo(path, ignoreCase, locale)(new URL(value).pathname)
  }, path)
