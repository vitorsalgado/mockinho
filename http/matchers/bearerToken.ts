import { equalTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'
import { matcherHint, res } from '@mockdog/matchers/internal'
import { SrvRequest } from '../request.js'

export const bearerToken =
  (matchers: Matcher<string> | string): Matcher<SrvRequest> =>
  request => {
    const matcherName = 'bearerToken'
    const auth = request.headers.authorization

    if (!auth) {
      return res(matcherName, () => matcherHint(matcherName), false)
    }

    const parts = auth.split(' ')

    if (parts.length === 2) {
      const scheme = parts[0]
      const value = parts[1]

      if (/^Bearer$/i.test(scheme)) {
        if (typeof matchers === 'string') {
          return equalTo(matchers)(value)
        }

        return matchers(value)
      }
    }

    return res(matcherName, () => matcherHint(matcherName), false)
  }
