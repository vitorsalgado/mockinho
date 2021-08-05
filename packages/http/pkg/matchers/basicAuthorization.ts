import { encodeBase64, Matcher } from '@mockinho/core'
import { equalsTo } from '@mockinho/core-matchers'
import { HttpRequest } from '../HttpRequest'

export const basicAuthorization = (
  username: string | Matcher<string>,
  password: string = ''
): Matcher<HttpRequest> => {
  return function basicAuthorization(request, ctx): boolean {
    const auth = request.headers.authorization

    if (!auth) {
      return false
    }

    const parts = auth.split(' ')

    if (parts.length === 2) {
      const scheme = parts[0]
      const value = parts[1]

      if (/^Basic$/i.test(scheme)) {
        if (typeof username === 'string') {
          if (!password) {
            throw new ReferenceError(
              'Parameter [password] is required when providing both username and password.'
            )
          }

          return equalsTo(encodeBase64(`${username}:${password}`))(value, ctx)
        }

        return username(value, ctx)
      } else {
        return false
      }
    }

    return false
  }
}
