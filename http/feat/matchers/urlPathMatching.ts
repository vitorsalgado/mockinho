import { URL } from 'url'
import { regex, Matcher } from '@mockdog/matchers'

export const urlPathMatching =
  (pattern: RegExp): Matcher<string> =>
  value =>
    regex(pattern)(new URL(value).pathname)
