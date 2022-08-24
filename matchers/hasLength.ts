import { Matcher } from './base.js'

export const hasLength = <T>(length: number): Matcher<Array<T> | string> =>
  function hasLength(value): boolean {
    return value.length === length
  }
