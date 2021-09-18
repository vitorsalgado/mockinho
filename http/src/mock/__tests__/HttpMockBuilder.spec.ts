import Supertest from 'supertest'
import { mockHttp } from '../../mockHttp'
import { opts } from '../../config'
import { get } from '../entry'
import { ok } from '../entry'

describe('Http Mock Builder', function () {
  const $ = mockHttp(opts().dynamicHttpPort().enableFileMocks(false))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('when providing a expectation with context', function () {
    it('should consider it when matching request', async function () {
      $.mock(
        get('/test')
          .expectWithContext((ctx, mock) => {
            const prop = '__test.times'

            mock.properties.set(prop, 0)

            return function (request) {
              expect(request).toBeDefined()
              expect(request.method).toEqual('GET')
              expect(request.path).toEqual('/test')

              mock.properties.set(prop, (mock.properties.get(prop) as number) + 1)

              return mock.properties.get(prop) !== 3
            }
          })
          .reply(ok())
      )

      await Supertest($.server()).get('/test').expect(200)
      await Supertest($.server()).get('/test').expect(200)
      await Supertest($.server()).get('/test').expect(500)
    })
  })
})
