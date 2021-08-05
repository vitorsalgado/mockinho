import { Matcher } from '@mockinho/core'

export const hasLength = <T>(length: number): Matcher<Array<T> | string> => {
  return function hasLength(value): boolean {
    return value.length === length
  }
}
