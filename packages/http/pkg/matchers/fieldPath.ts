import { createMatcher, Matcher } from '@mockinho/core'
import { jsonPath } from '@mockinho/core-matchers'

export const fieldPath = <T>(path: string, matcher: Matcher<T>): Matcher<any> =>
  createMatcher('fieldPath', (value, ctx): boolean => jsonPath(path, matcher)(value, ctx))
