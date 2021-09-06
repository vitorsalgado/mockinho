import Supertest from 'supertest'
import { repeatTimes } from '@mockinho/core-matchers'
import { opts } from '..'
import { get } from '..'
import { urlPath } from '..'
import { okJSON } from '..'
import { Headers } from '..'
import { MediaTypes } from '..'
import { ok } from '..'
import { mockHttp } from '..'

describe('Stateful Matchers', function () {
  const $ = mockHttp(opts().dynamicHttpPort().trace())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.removeAll())

  describe('when using repeatTimes() matcher', function () {
    describe('and it did not reach maximum allowed value', function () {
      it('should return response fixture', function () {
        const expected = 'test ok'

        $.mock(
          get(urlPath('/test'))
            .expect(repeatTimes(2))
            .reply(okJSON({ data: expected }))
        )

        return Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)
          .expect(res => expect(res.body.data).toEqual(expected))
      })
    })

    describe('and it did reach the maximum allowed value', function () {
      it('should fail to return response fixture', async function () {
        $.mock(get(urlPath('/test')).expect(repeatTimes(2)).reply(ok()))

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
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
            .repeatTimes(2)
            .reply(okJSON({ data: expected }))
        )

        return Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)
          .expect(res => expect(res.body.data).toEqual(expected))
      })
    })

    describe('and it did reach the maximum allowed value', function () {
      it('should fail to return response fixture', async function () {
        $.mock(get(urlPath('/test')).repeatTimes(2).reply(ok()))

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(500)
      })
    })
  })
})
