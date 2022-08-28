import { Matcher } from './base.js'
import { equalsTo } from './equalsTo.js'

export const anyItem = (...items: Array<string>): Matcher<string> =>
  function anyItem(value, ctx): boolean {
    return items.some(x => equalsTo(x)(value, ctx))
  }
