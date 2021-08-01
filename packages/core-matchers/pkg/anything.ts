import { createMatcher, Matcher } from '@mockinho/core'

export const anything = (): Matcher<any> =>
  createMatcher(
    'anything',

    (): boolean => true
  )
