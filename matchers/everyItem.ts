import { Matcher } from './base.js'

export const everyItem = <T>(matcher: Matcher<T>): Matcher<Array<T>> =>
  function everyItem(value): boolean {
    return value.every(item => matcher(item))
  }
