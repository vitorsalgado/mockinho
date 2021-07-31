import { HttpRequest } from '../../../http/HttpRequest'
import { equalsTo } from '../equalsTo'
import { createMatcher, Matcher } from '../base'

export const bearerToken = (expectation: Matcher<string> | string): Matcher<HttpRequest> =>
  createMatcher(
    'bearerToken',

    (request, ctx): boolean => {
      const auth = request.headers.authorization

      if (!auth) {
        return false
      }

      const parts = auth.split(' ')

      if (parts.length === 2) {
        const scheme = parts[0]
        const value = parts[1]

        if (/^Bearer$/i.test(scheme)) {
          if (typeof expectation === 'string') {
            return equalsTo(expectation)(value, ctx)
          }

          return expectation(value, ctx)
        }
      }

      return false
    }
  )
