import Supertest from 'supertest'
import { containing } from '@mockinho/core-matchers'
import { FastifyConfigurationsBuilder } from '../config'
import { FastifyHttpServer } from '../FastifyHttpServer'
import { FastifyRequestHandler } from '../FastifyRequestHandler'
import { HttpContext } from '../HttpContext'
import { mockinhoHTTP, opts, post } from '..'
import { urlPath } from '../matchers'
import { okJSON } from '../stub'
import { Headers, MediaTypes } from '../types'

describe('Fastify Http Server', function () {
  const $ = mockinhoHTTP(opts().dynamicPort().trace())

  const builder = new FastifyConfigurationsBuilder()

  const cfg = builder
    .port(3000)
    .verbose(false)
    .loadFileStubs(false)
    .disableDefaultLogger(false)
    .defaultLoggerLevel('warn')
    .trace()
    .formBodyOptions({ bodyLimit: 1000 })
    .cors({ maxAge: 10 })
    .multiPartOptions({ addToBody: true })
    .build()

  const ctx = new HttpContext(cfg)
  const httpServer = new FastifyHttpServer(cfg, new FastifyRequestHandler(ctx))

  beforeAll(() => $.start())
  afterAll(async () => {
    await $.finalize()
    await httpServer.close()
  })
  afterEach(() => $.cleanAll())

  it('should return server connection information', async function () {
    await httpServer.start()

    expect(httpServer.info().port).toEqual(3000)
  })

  it('should accept empty json requests', function () {
    const expected = 'test ok'

    $.mock(
      post(urlPath('/test'))
        .header('content-type', containing('json'))
        .reply(okJSON({ data: expected }))
    )

    return Supertest($.server())
      .post('/test?q=term')
      .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
      .send(undefined)
      .expect(200)
      .expect(res => expect(res.body.data).toEqual(expected))
  })

  it('should return 400 when unable to parse invalid json body', function () {
    const expected = 'test ok'

    $.mock(
      post(urlPath('/test'))
        .header('content-type', containing('json'))
        .reply(okJSON({ data: expected }))
    )

    return Supertest($.server())
      .post('/test?q=term')
      .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
      .send('<?xml version="1.0" encoding="UTF-8"?><test><name>tester</name></test>')
      .expect(400)
  })
})
