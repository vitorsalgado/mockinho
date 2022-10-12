import Supertest from 'supertest'
import { httpMock, opts } from '../index.js'
import { urlPath } from '../feat/matchers/index.js'
import { del, get, head, patch, post, put, request } from '../builder.js'
import { ok } from '../reply/index.js'

describe('CORS', function () {
  const $ = httpMock(opts().dynamicHttpPort().enableCors({ methods: '*' }))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('server should work with CORS setup', async function () {
    const scope = $.mock([
      get(urlPath('/test')).reply(ok()),
      post(urlPath('/test')).reply(ok()),
      put(urlPath('/test')).reply(ok()),
      del(urlPath('/test')).reply(ok()),
      patch(urlPath('/test')).reply(ok()),
      head(urlPath('/test')).reply(ok()),
      request(urlPath('/test')).method('OPTIONS').reply(ok()),
    ])

    await Supertest($.listener()).get('/test').expect(200)
    await Supertest($.listener()).post('/test').expect(200)
    await Supertest($.listener()).put('/test').expect(200)
    await Supertest($.listener()).del('/test').expect(200)
    await Supertest($.listener()).patch('/test').expect(200)
    await Supertest($.listener()).head('/test').expect(200)
    await Supertest($.listener()).options('/test').expect(200)

    expect(scope.isDone()).toBeTruthy()
  })
})
