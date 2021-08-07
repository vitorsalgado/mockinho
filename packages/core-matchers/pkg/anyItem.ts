import { Matcher } from '@mockinho/core'
import { notNull } from '@mockinho/core'
import { notEmpty } from '@mockinho/core'
import { equalsTo } from './equalsTo'

export const anyItem = (expectation: Array<string>): Matcher<string> => {
  notNull(expectation)
  notEmpty(expectation)

  return function anyItem(value, ctx): boolean {
    return expectation.some(x => equalsTo(x)(value, ctx))
  }
}
