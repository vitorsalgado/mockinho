import { URL } from 'url'
import { equalsTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'

export const urlPath =
  (
    path: string,
    ignoreCase: boolean = false,
    locale: string | string[] | undefined = undefined,
  ): Matcher<string> =>
  value =>
    equalsTo(path, ignoreCase, locale)(new URL(value).pathname)
