import { encodeBase64 } from '@mockdog/core'
import { equalsTo } from '@mockdog/matchers'
import { HttpRequest } from '../../HttpRequest'
import { basicAuthorization } from '../basicAuthorization'

describe('Basic Authorization', function () {
  it('should accept raw username and password but match with base 64 converted values', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'
    const encoded = encodeBase64(`${username}:${password}`)

    const req: HttpRequest = {
      headers: {
        authorization: `BAsiC ${encoded}`
      }
    } as any

    expect(basicAuthorization(username, password)(req)).toBeTruthy()
    expect(basicAuthorization(equalsTo(encoded))(req)).toBeTruthy()
  })

  it('should throw error when username is provided but password no', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'

    const req: HttpRequest = {
      headers: {
        authorization: `BAsiC ${encodeBase64(`${username}:${password}`)}`
      }
    } as any

    const matcher = basicAuthorization(username)

    expect(() => matcher(req)).toThrow()
  })

  it('should return false when there is no authorization header', function () {
    const req: HttpRequest = {
      headers: {}
    } as any

    expect(basicAuthorization('test')(req)).toBeFalsy()
  })

  it('should return false when authorization header does not contain the Basic schema', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'

    const req: HttpRequest = {
      headers: {
        authorization: `${encodeBase64(`${username}:${password}`)}`
      }
    } as any

    expect(basicAuthorization(username)(req)).toBeFalsy()
  })

  it('should return false when authorization header contains an invalid schema', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'

    const req: HttpRequest = {
      headers: {
        authorization: `Test ${encodeBase64(`${username}:${password}`)}`
      }
    } as any

    expect(basicAuthorization(username)(req)).toBeFalsy()
  })
})
