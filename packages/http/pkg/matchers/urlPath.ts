import { URL } from 'url'
import { createMatcher, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const urlPath = (
  path: string,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined
): Matcher<string> =>
  createMatcher(
    'urlPath',

    (value, ctx): boolean => equalsTo(path, ignoreCase, locale)(new URL(value).pathname, ctx),
    path
  )
