import { createMatcher, Matcher } from './base'

export const anything = (): Matcher<any> =>
  createMatcher(
    'anything',

    (): boolean => true
  )
