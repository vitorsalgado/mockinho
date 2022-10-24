import Supertest from 'supertest'
import { httpMock, opts, req } from '../index.js'

describe('app', function () {
  describe('assertions', function () {
    const $ = httpMock(opts().dynamicHttpPort())

    $.mock(req.get('/test').reply(200))

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.resetMocks())

    test('assert called', async function () {
      await Supertest($.listener())
        .get('/test')
        .expect(res => {
          expect(res.status).toEqual(200)
        })

      expect(() => $.assertCalled()).not.toThrow()
      expect(() => $.assertHits(1)).not.toThrow()
      expect(() => $.assertNotCalled()).toThrow()
    })
  })
})
