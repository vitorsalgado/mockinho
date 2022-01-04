import { LoggerUtil, Matcher } from '@mockdog/core'
import { reach } from '@mockdog/core'

export const jsonPath = <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  function jsonPath(value): boolean {
    if (typeof value !== 'object') {
      LoggerUtil.instance().warn(
        '[jsonPath] received a value that is not a object. Returning false.'
      )
      return false
    }

    if (path.startsWith('$.')) {
      path = path.substring(2, path.length)
    }

    return matcher(reach(path, value))
  }
