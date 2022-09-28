import { URL } from 'url'
import { equalsTo } from 'matchers'
import { Matcher } from '@mockdog/core'
import { createMatcher } from '@mockdog/core'

export const urlPath = (
  path: string,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined,
): Matcher<string> =>
  createMatcher(function urlPath(value): boolean {
    return equalsTo(path, ignoreCase, locale)(new URL(value).pathname)
  }, path)