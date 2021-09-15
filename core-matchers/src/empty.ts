import { Matcher } from '@mockinho/core'

export const empty = <T>(): Matcher<Array<T> | string> =>
  function empty(value): boolean {
    return value.length === 0
  }
