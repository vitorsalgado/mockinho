import { Matcher } from '@mockdog/core'
import { equalsTo } from './equalsTo.js'

export const contains = (expected: string): Matcher<string> =>
  function contains(value): boolean {
    if (value === null || typeof value === 'undefined') {
      return false
    }

    if (Array.isArray(value)) {
      return value.some(x => equalsTo(expected)(x))
    }

    return String(value).includes(expected)
  }
