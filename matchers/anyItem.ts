import { Matcher } from './base.js'
import { equalsTo } from './equalsTo.js'

export const anyItem = (...items: Array<string>): Matcher<string> =>
  function anyItem(value): boolean {
    return items.some(x => equalsTo(x)(value))
  }
