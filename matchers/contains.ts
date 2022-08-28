import { Matcher } from './base.js'
import { equalsTo } from './equalsTo.js'

export const contains = (expected: string): Matcher<string | string[]> =>
  function contains(value, ctx): boolean {
    if (Array.isArray(value)) {
      return value.some(x => equalsTo(expected)(x, ctx))
    }

    return String(value).includes(expected)
  }
