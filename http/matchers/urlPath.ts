import { URL } from 'url'
import { Matcher } from '@mockdog/core'
import { createMatcher } from '@mockdog/core'
import { equalsTo } from '@mockdog/matchers'

export const urlPath = (
  path: string,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined
): Matcher<string> =>
  createMatcher(function urlPath(value): boolean {
    return equalsTo(path, ignoreCase, locale)(new URL(value).pathname)
  }, path)
