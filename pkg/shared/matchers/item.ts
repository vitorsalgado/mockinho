import { createMatcher, Matcher } from './base'

export const item = <T>(index: number, matcher: Matcher<T>): Matcher<Array<T>> =>
  createMatcher(
    'item',

    (value, ctx): boolean => matcher(value[index], ctx)
  )
