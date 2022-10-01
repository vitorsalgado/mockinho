import { equalsTo } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'
import { matcherHint, res } from '@mockdog/matchers/internal'
import { base64 } from '@mockdog/x'
import { HttpRequest } from '../HttpRequest.js'

export const basicAuth =
  (username: string | Matcher<string>, password: string = ''): Matcher<HttpRequest> =>
  received => {
    const matcherName = 'basicAuth'
    const auth = received.headers.authorization

    if (!auth) {
      return res(matcherName, () => matcherHint(matcherName), false)
    }

    const parts = auth.split(' ')

    if (parts.length === 2) {
      const scheme = parts[0]
      const value = parts[1]

      if (/^Basic$/i.test(scheme)) {
        if (typeof username === 'string') {
          if (!password) {
            throw new ReferenceError(
              'Parameter [password] is required when providing both username and password.',
            )
          }

          return equalsTo(base64.encode(`${username}:${password}`))(value)
        }

        return username(value)
      } else {
        return res(matcherName, () => matcherHint(matcherName), false)
      }
    }

    return res(matcherName, () => matcherHint(matcherName), false)
  }
