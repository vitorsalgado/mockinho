import { URL } from 'url'
import { createMatcher, Matcher } from '@mockinho/core'
import { matching } from '@mockinho/core-matchers'

export const urlPathMatching = (pattern: RegExp): Matcher<string> =>
  createMatcher(
    'urlPathMatching',

    (value, ctx): boolean => matching(pattern)(new URL(value).pathname, ctx),
    pattern
  )
