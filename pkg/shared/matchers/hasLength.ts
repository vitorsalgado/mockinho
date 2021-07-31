import { createMatcher, Matcher } from './base'

export const hasLength = <T>(length: number): Matcher<Array<T> | string> =>
  createMatcher(
    'hasLength',

    (value): boolean => value.length === length
  )
