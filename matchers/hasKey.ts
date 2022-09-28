import { Matcher } from './base.js'
import { jsonPath } from './jsonPath.js'
import { isPresent } from './isPresent.js'

export const hasKey = (path: string): Matcher<unknown> =>
  function hasKey(value): boolean {
    return jsonPath(path, isPresent())(value)
  }