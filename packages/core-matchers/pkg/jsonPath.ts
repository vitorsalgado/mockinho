import { createMatcher, LoggerUtil, Matcher, reach } from '@mockinho/core'

export const jsonPath = <T>(path: string, matcher: Matcher<T>): Matcher<any> =>
  createMatcher(
    'jsonPath',

    (value, ctx): boolean => {
      if (typeof value !== 'object') {
        LoggerUtil.instance().warn(
          '[jsonPath] received a value that is not a object. Returning false.'
        )
        return false
      }

      if (path.startsWith('$.')) {
        path = path.substring(2, path.length)
      }

      return matcher(reach(path, value), ctx)
    }
  )
