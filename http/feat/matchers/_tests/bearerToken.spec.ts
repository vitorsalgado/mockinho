import { equalTo } from '@mockdog/matchers'
import { SrvRequest } from '../../../request.js'
import { bearerToken } from '../bearerToken.js'

describe('Bearer Token', function () {
  it('should apply matcher to the header authorization: bearer <token> no matter the case and return true when it matches', function () {
    const token = 'mdaskdm0192onldakfm'
    const req: SrvRequest = {
      headers: {
        authorization: `bEaRer ${token}`,
      },
    } as any

    const res = bearerToken(equalTo(token))(req)
    const wrong = bearerToken(equalTo('some-other-token'))(req)

    expect(res.pass).toBeTruthy()
    expect(wrong.pass).toBeFalsy()
  })

  it('should use equalTo when expectation is a string', function () {
    const token = 'mdaskdm0192onldakfm'
    const req: SrvRequest = {
      headers: {
        authorization: `bEaRer ${token}`,
      },
    } as any

    const res = bearerToken(token)(req)

    expect(res.pass).toBeTruthy()
  })

  it('should apply matcher', function () {
    const token = 'mdaskdm0192onldakfm'
    const req: SrvRequest = {
      headers: {
        authorization: `bEaRer ${token}`,
      },
    } as any

    expect(bearerToken(equalTo(token))(req).pass).toBeTruthy()
  })

  it('should return false when there is no authorization header', function () {
    const req: SrvRequest = {
      headers: {},
    } as any

    const matcher = bearerToken('test')

    expect(matcher(req).pass).toBeFalsy()
  })

  it('should return false when authorization header does not contain the Bearer schema', function () {
    const token = 'a-nice-dev'

    const req: SrvRequest = {
      headers: {
        authorization: token,
      },
    } as any

    expect(bearerToken(token)(req).pass).toBeFalsy()
    expect(bearerToken(equalTo(token))(req).pass).toBeFalsy()
  })

  it('should return false when authorization header contains an invalid schema', function () {
    const token = 'a-nice-dev'

    const req: SrvRequest = {
      headers: {
        authorization: `Beaver ${token}`,
      },
    } as any

    expect(bearerToken(token)(req).pass).toBeFalsy()
    expect(bearerToken(equalTo(token))(req).pass).toBeFalsy()
  })
})
