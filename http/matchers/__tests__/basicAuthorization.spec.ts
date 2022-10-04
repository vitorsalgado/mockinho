import { equalTo } from '@mockdog/matchers'
import { base64 } from '@mockdog/x'
import { HttpRequest } from '../../request.js'
import { basicAuth } from '../basicAuth.js'

describe('Basic Authorization', function () {
  it('should accept raw username and password but match with base 64 converted values', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'
    const encoded = base64.encode(`${username}:${password}`)

    const req: HttpRequest = {
      headers: {
        authorization: `BAsiC ${encoded}`,
      },
    } as any

    expect(basicAuth(username, password)(req).pass).toBeTruthy()
    expect(basicAuth(equalTo(encoded))(req).pass).toBeTruthy()
  })

  it('should throw error when username is provided but password no', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'

    const req: HttpRequest = {
      headers: {
        authorization: `BAsiC ${base64.encode(`${username}:${password}`)}`,
      },
    } as any

    const matcher = basicAuth(username)

    expect(() => matcher(req)).toThrow()
  })

  it('should return false when there is no authorization header', function () {
    const req: HttpRequest = {
      headers: {},
    } as any

    expect(basicAuth('test')(req).pass).toBeFalsy()
  })

  it('should return false when authorization header does not contain the Basic schema', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'

    const req: HttpRequest = {
      headers: {
        authorization: `${base64.encode(`${username}:${password}`)}`,
      },
    } as any

    expect(basicAuth(username)(req).pass).toBeFalsy()
  })

  it('should return false when authorization header contains an invalid schema', function () {
    const username = 'a-nice-dev'
    const password = 'super-secret-pwd'

    const req: HttpRequest = {
      headers: {
        authorization: `Test ${base64.encode(`${username}:${password}`)}`,
      },
    } as any

    expect(basicAuth(username)(req).pass).toBeFalsy()
  })
})
