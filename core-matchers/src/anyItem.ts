import { Matcher } from '@mockinho/core'
import { notNull } from '@mockinho/core'
import { notEmpty } from '@mockinho/core'
import { equalsTo } from './equalsTo'

export const anyItem = (expected: Array<string>): Matcher<string> => {
  notNull(expected)
  notEmpty(expected)

  return function anyItem(value): boolean {
    return expected.some(x => equalsTo(x)(value))
  }
}
