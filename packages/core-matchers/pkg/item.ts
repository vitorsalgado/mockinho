import { Matcher } from '@mockinho/core'

export const item = <T>(index: number, matcher: Matcher<T>): Matcher<Array<T>> => {
  return function item(value, ctx): boolean {
    return matcher(value[index], ctx)
  }
}
