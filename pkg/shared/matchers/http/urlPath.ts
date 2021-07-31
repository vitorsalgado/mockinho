import { URL } from 'url'
import { equalsTo } from '../equalsTo'
import { createMatcher, Matcher } from '../base'

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
