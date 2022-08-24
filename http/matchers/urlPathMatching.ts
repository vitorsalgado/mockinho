import { URL } from 'url'
import { Matcher } from '@mockdog/core'
import { matches } from '@mockdog/matchers'

export const urlPathMatching = (pattern: RegExp): Matcher<string> =>
  function urlPathMapping(value): boolean {
    return matches(pattern)(new URL(value).pathname)
  }
