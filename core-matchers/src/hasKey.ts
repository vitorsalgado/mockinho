import { Matcher } from '@mockdog/core'
import { jsonPath } from './jsonPath'
import { isPresent } from './isPresent'

export const hasKey = (path: string): Matcher<unknown> =>
  function hasKey(value): boolean {
    return jsonPath(path, isPresent())(value)
  }
