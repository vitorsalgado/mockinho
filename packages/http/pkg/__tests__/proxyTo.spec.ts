import Supertest from 'supertest'
import { containing } from '@mockinho/core-matchers'
import { anything } from '@mockinho/core-matchers'
import { equalsTo } from '@mockinho/core-matchers'
import { mockinhoHTTP, opts, get, urlPath, Headers, MediaTypes } from '..'
import { okJSON } from '..'
import { response } from '..'

describe('Proxied Responses', function () {
  const $ = mockinhoHTTP(opts().dynamicPort().trace())
  const P = mockinhoHTTP(opts().dynamicPort().trace())

  beforeAll(() => Promise.all([$.start(), P.start()]))
  afterAll(() => Promise.all([$.finalize(), P.finalize()]))
  afterEach(() => {
    $.cleanAll()
    P.cleanAll()
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
          .header('content-type', containing('json'))
          .proxyTo(
            `http://localhost:${P.info().port}`,
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
})
