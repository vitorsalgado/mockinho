import Supertest from 'supertest'
import { repeatTimes } from '@mockdog/matchers'
import { get, opts } from '../index.js'
import { urlPath } from '../index.js'
import { H } from '../index.js'
import { MediaTypes } from '../index.js'
import { httpMock } from '../index.js'
import { ok, okJSON } from '../mock/reply/index.js'

describe('Stateful Matchers', function () {
  const $ = httpMock(opts().dynamicHttpPort().trace())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('when using repeatTimes() matcher', function () {
    describe('and it did not reach maximum allowed value', function () {
      it('should return response fixture', function () {
        const expected = 'test ok'

        $.mock(
          get(urlPath('/test'))
            .expect(repeatTimes(2))
            .reply(okJSON({ data: expected })),
        )

        return Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)
          .expect(res => expect(res.body.data).toEqual(expected))
      })
    })

    describe('and it did reach the maximum allowed value', function () {
      it('should fail to return response fixture', async function () {
        $.mock(get(urlPath('/test')).expect(repeatTimes(2)).reply(ok()))

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(500)
      })
    })
  })

  describe('when using .repeatTimes() from mock builder', function () {
    describe('and it did not reach maximum allowed value', function () {
      it('should return response fixture', function () {
        const expected = 'test ok'

        $.mock(
          get(urlPath('/test'))
            .repeat(2)
            .reply(okJSON({ data: expected })),
        )

        return Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)
          .expect(res => expect(res.body.data).toEqual(expected))
      })
    })

    describe('and it did reach the maximum allowed value', function () {
      it('should fail to return response fixture', async function () {
        $.mock(get(urlPath('/test')).repeat(2).reply(ok()))

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(500)
      })
    })
  })
})
