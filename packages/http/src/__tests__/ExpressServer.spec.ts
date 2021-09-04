import Supertest from 'supertest'
import { containing } from '@mockinho/core-matchers'
import { ScenarioInMemoryRepository } from '@mockinho/core'
import { HttpContext } from '../HttpContext'
import { opts, post, ConfigurationBuilder, HttpServer } from '..'
import { HttpMockRepository } from '..'

import { urlPath } from '../matchers'
import { okJSON } from '../mock'
import { Headers, MediaTypes } from '../types'
import mockHttp from '../mockHttp'

describe('Express Http Server', function () {
  const $ = mockHttp(opts().dynamicHttpPort().trace())

  const builder = new ConfigurationBuilder()

  const cfg = builder
    .httpPort(3000)
    .info()
    .enableFileMocks(false)
    .logLevel('warn')
    .trace()
    .formUrlEncodedOptions({ limit: 1000 })
    .enableCors({ maxAge: 10 })
    .build()

  const ctx = new HttpContext(cfg, new HttpMockRepository(), new ScenarioInMemoryRepository())
  const httpServer = new HttpServer(ctx)

  beforeAll(() => $.start())
  afterAll(async () => {
    await $.finalize()
    await httpServer.close()
  })
  afterEach(() => $.removeAll())

  it('should return server connection information', async function () {
    await httpServer.start()

    expect(httpServer.info().httpPort).toEqual(3000)
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
