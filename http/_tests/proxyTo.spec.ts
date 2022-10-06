import Supertest from 'supertest'
import { contains, field } from '@mockdog/matchers'
import { equalTo } from '@mockdog/matchers'
import { opts, urlPath, H, MediaTypes, post } from '../index.js'
import { okJSON } from '../index.js'
import { mockHttp } from '../index.js'
import { forwardedFrom } from '../mock/forward.js'
import { configureProxy } from '../proxy.js'
import { HttpContext } from '../index.js'

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
        post(urlPath('/test'))
          .header('proxy-header', equalTo('100'))
          .header('x-test', equalTo('true'))
          .header('x-dev', equalTo('ts'))
          .query('term', equalTo('hi'))
          .requestBody(field('test', equalTo('proxy-reply')))
          .reply(okJSON({ hello: 'world' })),
      )

      $.mock(
        post(urlPath('/test'))
          .header('content-type', contains('json'))
          .reply(
            forwardedFrom()
              .target(`http://localhost:${P.serverInfo().http.port}`)
              .responseHeader('test', 'ok')
              .proxyHeader('proxy-header', '100')
              .proxyHeaders({ 'x-test': 'true', 'x-dev': 'ts' }),
          ),
      )

      return Supertest($.listener())
        .post('/test?term=hi')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .send({ test: 'proxy-reply' })
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
            target: undefined,
          },
        },
      }
      expect(() => configureProxy(ctx as HttpContext, null as any, null as any))
    })
  })
})
