import { Matcher } from '@mockdog/core'
import { notNull } from '@mockdog/core'
import { notEmpty } from '@mockdog/core'
import { equalsTo } from './equalsTo.js'

export const anyItem = (expected: Array<string>): Matcher<string> => {
  notNull(expected)
  notEmpty(expected)

  return function anyItem(value): boolean {
    return expected.some(x => equalsTo(x)(value))
  }
}
