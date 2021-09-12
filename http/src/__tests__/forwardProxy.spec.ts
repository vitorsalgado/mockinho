import Supertest from 'supertest'
import { equalsTo } from '@mockinho/core-matchers'
import { jsonPath } from '@mockinho/core-matchers'
import { opts, get, urlPath, Headers, MediaTypes } from '..'
import { okJSON } from '..'
import { mockHttp } from '..'
import { badRequestJSON } from '..'
import { StatusCodes } from '..'
import { post } from '..'

describe('Forward Proxy', function () {
  const target = mockHttp(opts().dynamicHttpPort().trace())

  beforeAll(() => target.start())
  afterAll(() => target.finalize())
  afterEach(() => target.resetMocks())

  describe('when forward proxying requests', function () {
    it('should return success response from target', async function () {
      const $ = mockHttp(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.serverInfo().http.host}:${target.serverInfo().http.port}`)
      )

      try {
        target.mock(
          get(urlPath('/test'))
            .header('proxy-header', equalsTo('100'))
            .header('x-test', equalsTo('true'))
            .header('x-dev', equalsTo('ts'))
            .reply(okJSON({ hello: 'world' }).header('x-proxy-reply', 'success'))
        )

        await $.start()

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
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
      const $ = mockHttp(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.serverInfo().http.host}:${target.serverInfo().http.port}`)
      )

      try {
        target.mock(
          get(urlPath('/test')).reply(
            badRequestJSON({ message: 'boom!' }).header('x-proxy-reply', 'failure')
          )
        )

        await $.start()

        await Supertest($.server())
          .get('/test')
          .set(Headers.Accept, MediaTypes.APPLICATION_JSON)
          .expect(StatusCodes.BAD_REQUEST)
          .expect(res => {
            expect(res.body.message).toEqual('boom!')
            expect(res.headers['x-proxy-reply']).toEqual('failure')
          })
      } finally {
        await $.finalize()
      }
    })

    it('should send the body', async function () {
      const $ = mockHttp(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.serverInfo().http.host}:${target.serverInfo().http.port}`)
      )

      try {
        target.mock(
          post(urlPath('/test'))
            .header('proxy-header', equalsTo('100'))
            .header('x-test', equalsTo('true'))
            .header('x-dev', equalsTo('ts'))
            .requestBody(jsonPath('data', equalsTo('test')))
            .reply(okJSON({ hello: 'world' }).header('x-proxy-reply', 'success'))
        )

        await $.start()

        await Supertest($.server())
          .post('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
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
      const $ = mockHttp(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.serverInfo().http.host}:${target.serverInfo().http.port}`, {
            proxyTimeout: 100
          })
      )

      try {
        target.mock(
          post(urlPath('/test')).reply(
            okJSON({ hello: 'world' }).header('x-proxy-reply', 'success')
          )
        )

        await $.start()

        await Supertest($.server())
          .post('/nowhere')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .send(JSON.stringify({ data: 'test' }))
          .set('proxy-header', '100')
          .set('x-test', 'true')
          .set('x-dev', 'ts')
          .expect(500)
          .expect(res => {
            expect(res.headers['content-type']).toContain('text/plain')
          })
      } finally {
        await $.finalize()
      }
    })
  })
})
