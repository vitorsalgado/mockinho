import Supertest from 'supertest'
import { equalsTo } from '@mockinho/core-matchers'
import { jsonPath } from '@mockinho/core-matchers'
import { opts } from '..'
import { post } from '..'
import { urlPath } from '..'
import { ok } from '..'
import mockaccinoHttp from '..'

describe('Cookies', function () {
  const $ = mockaccinoHttp(opts().dynamicHttpPort().cookieOptions('super-secret'))
  const cookieSignedName = 'cookie-test'
  const cookieSignedValue = 's%3Atest.d7jIkuqZkCaFT0czqQ8b6KyUv077GFUH1mxQR%2Fj7SyQ'

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

  describe('when a signed cookie is sent', function () {
    it('should apply matchers on the unsigned value', function () {
      $.mock(
        post(urlPath('/test'))
          .cookie(cookieSignedName, equalsTo('test'))
          .reply(ok().body('done').cookie('cookie-test-res', 'test-res'))
      )

      return Supertest($.server())
        .post('/test')
        .set('Cookie', `${cookieSignedName}=${cookieSignedValue}`)
        .expect(200)
        .expect(res => expect(res.text).toEqual('done'))
    })
  })

  describe('when a regular cookie is sent', function () {
    it('should apply matchers on cookie value', function () {
      $.mock(
        post(urlPath('/test')).cookie(cookieSignedName, equalsTo('test')).reply(ok().body('done'))
      )

      return Supertest($.server())
        .post('/test')
        .set('Cookie', `${cookieSignedName}=test`)
        .expect(200)
        .expect(res => expect(res.text).toEqual('done'))
    })
  })

  describe('when a json cookie is sent', function () {
    it('should convert value to object before applying matchers when calling .cookieJson()', function () {
      $.mock(
        post(urlPath('/test'))
          .cookieJson(cookieSignedName, jsonPath('data.hello', equalsTo('world')))
          .reply(ok().body('done'))
      )

      return Supertest($.server())
        .post('/test')
        .set('Cookie', `${cookieSignedName}=${JSON.stringify({ data: { hello: 'world' } })}`)
        .expect(200)
        .expect(res => expect(res.text).toEqual('done'))
    })
  })

  describe('when a response definition contains cookies', function () {
    it('should return the specified cookies on response headers', function () {
      $.mock(
        post(urlPath('/test')).reply(
          ok()
            .body('done')
            .cookie('cookie-normal', 'hello')
            .cookie(cookieSignedName, 'test', { signed: true })
            .cookieJson('cookie-json', { data: { hello: 'world' } })
            .clearCookie('cookie-del-1', { path: '/' })
            .clearCookies({ key: 'cookie-del-2' }, { key: 'cookie-del-3' })
        )
      )

      return Supertest($.server())
        .post('/test')
        .set('Cookie', `${cookieSignedName}=${JSON.stringify({ data: { hello: 'world' } })}`)
        .expect(200)
        .expect(res => expect(res.headers['set-cookie']).toHaveLength(6))
    })
  })
})
