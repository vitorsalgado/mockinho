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
      expect($.hits()).toEqual(0)
      expect(() => $.assertCalled()).toThrow()
      expect(() => $.assertHits(0)).not.toThrow()
      expect(() => $.assertHits(1)).toThrow()
      expect(() => $.assertNotCalled()).not.toThrow()

      $.printPending()

      await Supertest($.listener())
        .get('/test')
        .expect(res => expect(res.status).toEqual(200))

      expect($.hits()).toEqual(1)
      expect(() => $.assertCalled()).not.toThrow()
      expect(() => $.assertHits(0)).toThrow()
      expect(() => $.assertHits(1)).not.toThrow()
      expect(() => $.assertNotCalled()).toThrow()

      await Supertest($.listener())
        .get('/test')
        .expect(res => expect(res.status).toEqual(200))

      await Supertest($.listener())
        .get('/test')
        .expect(res => expect(res.status).toEqual(200))

      expect($.hits()).toEqual(3)
      expect(() => $.assertCalled()).not.toThrow()
      expect(() => $.assertHits(0)).toThrow()
      expect(() => $.assertHits(3)).not.toThrow()
      expect(() => $.assertNotCalled()).toThrow()

      $.printPending()
    })
  })
})
