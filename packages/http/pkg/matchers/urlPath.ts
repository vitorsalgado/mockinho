import { URL } from 'url'
import { Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'

export const urlPath = (
  path: string,
  ignoreCase: boolean = false,
  locale: string | string[] | undefined = undefined
): Matcher<string> => {
  return function urlPath(value, ctx): boolean {
    return equalsTo(path, ignoreCase, locale)(new URL(value).pathname, ctx)
  }
}
