import { createMatcher, Matcher } from '@mockinho/core'

export const hasLength = <T>(length: number): Matcher<Array<T> | string> =>
  createMatcher(
    'hasLength',

    (value): boolean => value.length === length
  )
