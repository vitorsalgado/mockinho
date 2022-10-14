import Supertest from 'supertest'
import { contains, field } from '@mockdog/matchers'
import { equalTo } from '@mockdog/matchers'
import { opts, urlPath, H, Media, post } from '../index.js'
import { httpMock } from '../index.js'
import { forwardedFrom } from './forward.js'
import { okJSON } from './replies.js'

describe('Proxied Responses', function () {
  const $ = httpMock(opts().dynamicHttpPort().trace())
  const P = httpMock(opts().dynamicHttpPort().trace())

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
              .target(`http://localhost:${P.info.http.port}`)
              .responseHeader('test', 'ok')
              .proxyHeader('proxy-header', '100')
              .proxyHeaders({ 'x-test': 'true', 'x-dev': 'ts' }),
          ),
      )

      return Supertest($.listener())
        .post('/test?term=hi')
        .set(H.ContentType, Media.JSON)
        .send({ test: 'proxy-reply' })
        .expect(200)
        .expect(res => {
          expect(res.headers.test).toEqual('ok')
          expect(res.body.hello).toEqual('world')
        })
    })
  })
})
