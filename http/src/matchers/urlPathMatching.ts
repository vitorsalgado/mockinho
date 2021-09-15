import { URL } from 'url'
import { Matcher } from '@mockinho/core'
import { matches } from '@mockinho/core-matchers'

export const urlPathMatching = (pattern: RegExp): Matcher<string> =>
  function urlPathMapping(value): boolean {
    return matches(pattern)(new URL(value).pathname)
  }
