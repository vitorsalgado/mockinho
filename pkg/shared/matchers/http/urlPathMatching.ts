import { URL } from 'url'
import { createMatcher, Matcher } from '../base'
import { matching } from '../regex'

export const urlPathMatching = (pattern: RegExp): Matcher<string> =>
  createMatcher(
    'urlPathMatching',

    (value, ctx): boolean => matching(pattern)(new URL(value).pathname, ctx),
    pattern
  )
