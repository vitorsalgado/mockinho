import { Matcher } from '@mockdog/core'
import { equalsTo } from '@mockdog/core-matchers'
import { HttpRequest } from '../HttpRequest.js'

export const bearerToken = (expectation: Matcher<string> | string): Matcher<HttpRequest> =>
  function bearerToken(request): boolean {
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
          return equalsTo(expectation)(value)
        }

        return expectation(value)
      }
    }

    return false
  }
