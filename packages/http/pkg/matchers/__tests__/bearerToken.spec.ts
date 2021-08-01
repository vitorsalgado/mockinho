import { equalsTo, fakeMatcherContext } from '@mockinho/core-matchers'
import { HttpRequest } from '../../HttpRequest'
import { bearerToken } from '../bearerToken'

describe('Bearer Token', function () {
  it('should apply matcher to the header authorization: bearer <token> no matter the case and return true when it matches', function () {
    const token = 'mdaskdm0192onldakfm'
    const req: HttpRequest = {
      headers: {
        authorization: `bEaRer ${token}`
      }
    } as any

    const res = bearerToken(equalsTo(token))(req, fakeMatcherContext())
    const wrong = bearerToken(equalsTo('some-other-token'))(req, fakeMatcherContext())

    expect(res).toBeTruthy()
    expect(wrong).toBeFalsy()
  })

  it('should use equalsTo when expectation is a string', function () {
    const token = 'mdaskdm0192onldakfm'
    const req: HttpRequest = {
      headers: {
        authorization: `bEaRer ${token}`
      }
    } as any

    const res = bearerToken(token)(req, fakeMatcherContext())

    expect(res).toBeTruthy()
  })

  it('should apply matcher', function () {
    const token = 'mdaskdm0192onldakfm'
    const req: HttpRequest = {
      headers: {
        authorization: `bEaRer ${token}`
      }
    } as any

    expect(bearerToken(equalsTo(token))(req, fakeMatcherContext())).toBeTruthy()
  })

  it('should return false when there is no authorization header', function () {
    const req: HttpRequest = {
      headers: {}
    } as any

    const matcher = bearerToken('test')

    expect(matcher(req, fakeMatcherContext())).toBeFalsy()
  })

  it('should return false when authorization header does not contain the Bearer schema', function () {
    const token = 'a-nice-dev'

    const req: HttpRequest = {
      headers: {
        authorization: token
      }
    } as any

    expect(bearerToken(token)(req, fakeMatcherContext())).toBeFalsy()
    expect(bearerToken(equalsTo(token))(req, fakeMatcherContext())).toBeFalsy()
  })

  it('should return false when authorization header contains an invalid schema', function () {
    const token = 'a-nice-dev'

    const req: HttpRequest = {
      headers: {
        authorization: `Beaver ${token}`
      }
    } as any

    expect(bearerToken(token)(req, fakeMatcherContext())).toBeFalsy()
    expect(bearerToken(equalsTo(token))(req, fakeMatcherContext())).toBeFalsy()
  })
})
