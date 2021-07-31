import Supertest from 'supertest'
import { containing } from '../../shared/matchers'
import { urlPath } from '../../shared/matchers/http'
import { FastifyConfigurationsBuilder } from '../config/FastifyConfigurationsBuilder'
import { FastifyHttpServer } from '../FastifyHttpServer'
import { FastifyRequestHandler } from '../FastifyRequestHandler'
import { HttpContext } from '../HttpContext'
import { mockrushHTTP, opts, post } from '../index'
import { okJSON } from '../stub/initializers/ok'
import { Headers, MediaTypes } from '../types'

describe('Fastify Http Server', function () {
  const $ = mockrushHTTP(opts().dynamicPort().trace())

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
