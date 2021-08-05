import { Matcher } from '@mockinho/core'
import { equalsTo } from './equalsTo'

export const containing = <V>(expectation: string): Matcher<V> => {
  return function containing(value, ctx): boolean {
    if (value === null || typeof value === 'undefined') {
      return false
    }

    if (Array.isArray(value)) {
      return value.some(x => equalsTo(expectation)(x, ctx))
    }

    return String(value).indexOf(expectation) > -1
  }
}
