import Supertest from 'supertest'
import { equalTo } from '@mockdog/matchers'
import { field } from '@mockdog/matchers'
import { opts, urlPath, H, Media } from '../../index.js'
import { httpMock } from '../../index.js'
import { SC } from '../../index.js'
import { get, post } from '../../builder.js'
import { badRequest, okJSON } from '../../reply/index.js'
import { AppVars } from '../../_internal/vars.js'

describe('Forward Proxy', function () {
  const target = httpMock(opts().dynamicHttpPort().trace())

  beforeAll(() => target.start())
  afterAll(() => target.finalize())
  afterEach(() => target.resetMocks())

  describe('when forward proxying requests', function () {
    it('should return success response from target', async function () {
      const $ = httpMock(
        opts().dynamicHttpPort().proxy(`http://${target.info.http.host}:${target.info.http.port}`),
      )

      try {
        target.mock(
          get(urlPath('/test'))
            .header('proxy-header', equalTo('100'))
            .header('x-test', equalTo('true'))
            .header('x-dev', equalTo('ts'))
            .reply(okJSON({ hello: 'world' }).header('x-proxy-reply', 'success')),
        )

        await $.start()

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, Media.JSON)
          .set('proxy-header', '100')
          .set('x-test', 'true')
          .set('x-dev', 'ts')
          .expect(200)
          .expect(res => {
            expect(res.body.hello).toEqual('world')
            expect(res.headers['x-proxy-reply']).toEqual('success')
          })
      } finally {
        await $.finalize()
      }
    })

    it('should return error response from target', async function () {
      const $ = httpMock(
        opts().dynamicHttpPort().proxy(`http://${target.info.http.host}:${target.info.http.port}`),
      )

      try {
        target.mock(
          get(urlPath('/test')).reply(
            badRequest().json({ message: 'boom!' }).header('x-proxy-reply', 'failure'),
          ),
        )

        await $.start()

        await Supertest($.listener())
          .get('/test')
          .set(H.Accept, Media.JSON)
          .expect(SC.BadRequest)
          .expect(res => {
            expect(res.body.message).toEqual('boom!')
            expect(res.headers['x-proxy-reply']).toEqual('failure')
          })
      } finally {
        await $.finalize()
      }
    })

    it('should send the body', async function () {
      const $ = httpMock(
        opts().dynamicHttpPort().proxy(`http://${target.info.http.host}:${target.info.http.port}`),
      )

      try {
        target.mock(
          post(urlPath('/test'))
            .header('proxy-header', equalTo('100'))
            .header('x-test', equalTo('true'))
            .header('x-dev', equalTo('ts'))
            .requestBody(field('data', equalTo('test')))
            .reply(okJSON({ hello: 'world' }).header('x-proxy-reply', 'success')),
        )

        await $.start()

        await Supertest($.listener())
          .post('/test')
          .set(H.ContentType, Media.JSON)
          .send(JSON.stringify({ data: 'test' }))
          .set('proxy-header', '100')
          .set('x-test', 'true')
          .set('x-dev', 'ts')
          .expect(200)
          .expect(res => {
            expect(res.body.hello).toEqual('world')
            expect(res.headers['x-proxy-reply']).toEqual('success')
          })
      } finally {
        await $.finalize()
      }
    })

    it('should capture proxy exceptions and return a 500 and plain text', async function () {
      const $ = httpMock(
        opts().dynamicHttpPort().proxy(`http://${target.info.http.host}:${target.info.http.port}`, {
          proxyTimeout: 100,
        }),
      )

      try {
        target.mock(
          post(urlPath('/test')).reply(
            okJSON({ hello: 'world' }).header('x-proxy-reply', 'success'),
          ),
        )

        await $.start()

        await Supertest($.listener())
          .post('/nowhere')
          .set(H.ContentType, Media.JSON)
          .send(JSON.stringify({ data: 'test' }))
          .set('proxy-header', '100')
          .set('x-test', 'true')
          .set('x-dev', 'ts')
          .expect(AppVars.NoMatchStatus)
          .expect(res => {
            expect(res.headers['content-type']).toContain('text/plain')
          })
      } finally {
        await $.finalize()
      }
    })
  })
})
