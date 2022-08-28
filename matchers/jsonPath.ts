import { Matcher } from './base.js'
import { reach } from './internal/objects/reach.js'

export const jsonPath = <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  function jsonPath(value, ctx): boolean {
    if (typeof value !== 'object') {
      return false
    }

    if (path.startsWith('$.')) {
      path = path.substring(2, path.length)
    }

    return matcher(reach(path, value), ctx)
  }
