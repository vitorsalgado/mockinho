import Supertest from 'supertest'
import { equalsTo } from '@mockdog/core-matchers'
import { Matcher } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { mockHttp } from '..'
import { opts } from '..'
import { ok } from '..'
import { HttpMock } from '..'
import { urlPath } from '..'
import { MediaTypes } from '..'
import { ResponseFixture } from '..'
import { post } from '..'
import { Headers } from '..'
import { extractQuery } from '../mock/util/extractors'

describe('Builder Alternatives', function () {
  const $ = mockHttp(opts().dynamicHttpPort().trace())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('when using $.mock', function () {
    it('should accept a function providing a HttpMock', function () {
      $.mock(
        () =>
          new HttpMock(
            '1',
            'test',
            0,
            'code',
            '',
            [
              {
                valueGetter: extractQuery('term') as (ctx: unknown) => unknown,
                matcher: equalsTo('test') as Matcher<unknown>,
                weight: 0
              }
            ],
            [],
            ok().build(),
            new Map(),
            new Map()
          )
      )

      return Supertest($.server()).post('/test?term=test').expect(200)
    })
  })

  describe('when using .reply', function () {
    const body = { message: 'hello' }

    it('should accept a function providing a response fixture', function () {
      $.mock(
        post(urlPath('/test'))
          .reply((context, request, mock) =>
            Promise.resolve(
              new ResponseFixture(
                200,
                {
                  'content-type': MediaTypes.APPLICATION_JSON,
                  'x-id': mock.id,
                  'x-verbose': String(modeIsAtLeast(context.configuration, 'verbose')),
                  'x-method': request.method
                },
                request.body
              )
            )
          )
          .id('test-id')
      )

      return Supertest($.server())
        .post('/test')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual(body)
          expect(res.header['x-id']).toEqual('test-id')
          expect(res.header['x-verbose']).toEqual(String(true))
          expect(res.header['x-method']).toEqual('POST')
        })
    })
  })
})
