import { Matcher } from '@mockinho/core'
import { equalsTo } from './equalsTo'

export const containing = <V>(expected: string): Matcher<V> =>
  function containing(value): boolean {
    if (value === null || typeof value === 'undefined') {
      return false
    }

    if (Array.isArray(value)) {
      return value.some(x => equalsTo(expected)(x))
    }

    return String(value).indexOf(expected) > -1
  }
