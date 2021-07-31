import Supertest from 'supertest'
import { urlPath } from '../../shared/matchers/http'
import { del, head, mockinhoHTTP, opts, patch, put } from '../index'
import { get, post } from '../stub'
import { ok } from '../stub/initializers/ok'

describe('CORS', function () {
  const $ = mockinhoHTTP(opts().dynamicPort().cors({ methods: '*' }))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

  it('server should work with CORS setup', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(ok()),
      post(urlPath('/test')).reply(ok()),
      put(urlPath('/test')).reply(ok()),
      del(urlPath('/test')).reply(ok()),
      patch(urlPath('/test')).reply(ok()),
      head(urlPath('/test')).reply(ok())
    )

    await Supertest($.server()).get('/test').expect(200)
    await Supertest($.server()).post('/test').expect(200)
    await Supertest($.server()).put('/test').expect(200)
    await Supertest($.server()).del('/test').expect(200)
    await Supertest($.server()).patch('/test').expect(200)
    await Supertest($.server()).head('/test').expect(200)

    expect(scope.isDone()).toBeTruthy()
  })
})
