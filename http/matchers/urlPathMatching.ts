import { URL } from 'url'
import { matches } from 'matchers'
import { Matcher } from '@mockdog/core'

export const urlPathMatching = (pattern: RegExp): Matcher<string> =>
  function urlPathMapping(value): boolean {
    return matches(pattern)(new URL(value).pathname)
  }
