import { URL } from 'url'
import { Matcher } from '@mockinho/core'
import { matching } from '@mockinho/core-matchers'

export const urlPathMatching = (pattern: RegExp): Matcher<string> =>
  function urlPathMapping(value): boolean {
    return matching(pattern)(new URL(value).pathname)
  }
