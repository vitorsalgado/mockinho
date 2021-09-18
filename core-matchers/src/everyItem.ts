import { Matcher } from '@mockdog/core'

export const everyItem = <T>(matcher: Matcher<T>): Matcher<Array<T>> =>
  function everyItem(value): boolean {
    return value.every(item => matcher(item))
  }
