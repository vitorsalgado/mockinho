import { Matcher } from '@mockdog/core'

export const hasLength = <T>(length: number): Matcher<Array<T> | string> =>
  function hasLength(value): boolean {
    return value.length === length
  }
