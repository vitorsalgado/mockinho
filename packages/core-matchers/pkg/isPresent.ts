import { Matcher } from '@mockinho/core'

export const isPresent = <T>(): Matcher<T> => {
  return function isPresent(value): boolean {
    if (value === null || typeof value === 'undefined') return false
    if (typeof value === 'string' || Array.isArray(value)) if (value.length === 0) return false

    return true
  }
}
