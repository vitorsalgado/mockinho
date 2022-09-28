import Supertest from 'supertest'
import { contains } from 'matchers'
import { ScenarioRepository } from '@mockdog/core'
import { HttpContext } from '../HttpContext'
import { opts, post, HttpConfigurationBuilder, HttpServer } from '../index.js'
import { HttpMockRepository } from '../index.js'

import { urlPath } from '../matchers'
import { okJSON } from '../mock'
import mockHttp from '../mockHttp'
import { MediaTypes } from '../MediaTypes'
import { Headers } from '../Headers'

describe('Express Http Server', function () {
  const $ = mockHttp(opts().dynamicHttpPort())

  const builder = new HttpConfigurationBuilder()

  const cfg = builder
    .httpPort(0)
    .info()
    .enableFileMocks(false)
    .internalLogLevel('warn')
    .trace()
    .formUrlEncodedOptions({ limit: 1000 })
    .enableCors({ maxAge: 10 })
    .build()

  const ctx = new HttpContext(cfg, new HttpMockRepository(), new ScenarioRepository())
  const httpServer = new HttpServer(ctx)

  beforeAll(() => $.start())
  afterAll(async () => {
    await $.finalize()
    await httpServer.close()
  })
  afterEach(() => $.resetMocks())

  it('should return server connection information', async function () {
    await httpServer.start()

    expect(httpServer.info().http.port).toBeGreaterThan(0)
  })

  it('should accept empty json requests', function () {
    const expected = 'test ok'

    $.mock(
      post(urlPath('/test'))
        .header('content-type', contains('json'))
        .reply(okJSON({ data: expected })),
    )

    return Supertest($.listener())
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
        .header('content-type', contains('json'))
        .reply(okJSON({ data: expected })),
    )

    return Supertest($.listener())
      .post('/test?q=term')
      .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
      .send('<?xml version="1.0" encoding="UTF-8"?><test><name>tester</name></test>')
      .expect(400)
  })
})
