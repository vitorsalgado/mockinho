import { Matcher } from './base.js'

export const empty = <T>(): Matcher<Array<T> | string> =>
  function empty(value): boolean {
    return value.length === 0
  }
