import { Matcher } from '@mockdog/core'

export const item = <T>(index: number, matcher: Matcher<T>): Matcher<Array<T>> =>
  function item(value): boolean {
    return matcher(value[index])
  }
