import { URL } from 'url'
import { equalTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'

export const urlPath =
  (
    path: string,
    ignoreCase: boolean = false,
    locale: string | string[] | undefined = undefined,
  ): Matcher<string> =>
  value =>
    equalTo(path, ignoreCase, locale)(new URL(value).pathname)
