import Supertest from 'supertest'
import { contains } from '@mockinho/core-matchers'
import { anything } from '@mockinho/core-matchers'
import { equalsTo } from '@mockinho/core-matchers'
import { opts, get, urlPath, Headers, MediaTypes } from '..'
import { okJSON } from '..'
import { response } from '..'
import { mockHttp } from '..'
import { configureProxy } from '../configureProxy'
import { HttpContext } from '..'

describe('Proxied Responses', function () {
  const $ = mockHttp(opts().dynamicHttpPort().trace())
  const P = mockHttp(opts().dynamicHttpPort().trace())

  beforeAll(() => Promise.all([$.start(), P.start()]))
  afterAll(() => Promise.all([$.finalize(), P.finalize()]))
  afterEach(() => {
    $.resetMocks()
    P.resetMocks()
  })

  describe('when proxying request', function () {
    it('should send additional headers and return response from target with appending provided headers', function () {
      P.mock(
        get(anything())
          .header('proxy-header', equalsTo('100'))
          .header('x-test', equalsTo('true'))
          .header('x-dev', equalsTo('ts'))
          .reply(okJSON({ hello: 'world' }))
      )

      $.mock(
        get(urlPath('/test'))
          .header('content-type', contains('json'))
          .proxyTo(
            `http://localhost:${P.serverInfo().http.port}`,
            response()
              .header('test', 'ok')
              .proxyHeader('proxy-header', '100')
              .proxyHeaders({ 'x-test': 'true', 'x-dev': 'ts' })
          )
      )

      return Supertest($.server())
        .get('/test')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => {
          expect(res.headers.test).toEqual('ok')
          expect(res.body.hello).toEqual('world')
        })
    })
  })

  describe('when configuring proxy', function () {
    it('should not accept an empty target', function () {
      const ctx = {
        configuration: {
          proxyOptions: {
            target: undefined
          }
        }
      }
      expect(() => configureProxy(ctx as HttpContext, null as any, null as any))
    })
  })
})
