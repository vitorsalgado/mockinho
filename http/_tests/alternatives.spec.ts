import Supertest from 'supertest'
import { equalTo, isUUID } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'
import { modeIsAtLeast } from '@mockdog/core'
import { HeaderList } from '../headers.js'
import { httpMock } from '../index.js'
import { opts } from '../index.js'
import { urlPath } from '../index.js'
import { MediaTypes } from '../index.js'
import { H } from '../index.js'
import { HttpMock } from '../mock.js'
import { post } from '../mock_builder.js'
import { ok, SrvResponse } from '../reply/index.js'
import { selector } from '../_internal/request_value_selectors.js'

describe('Builder Alternatives', function () {
  const $ = httpMock(opts().dynamicHttpPort().trace())

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
                target: '',
                selector: selector.query('term') as (ctx: unknown) => unknown,
                matcher: equalTo('test') as Matcher<unknown>,
                score: 0,
              },
            ],
            ok(),
          ),
      )

      return Supertest($.listener()).post('/test?term=test').expect(200)
    })
  })

  describe('when using .reply', function () {
    const body = { message: 'hello' }

    it('should accept a function providing a response fixture', function () {
      $.mock(
        post(urlPath('/test'))
          .reply((req, res, ctx) =>
            Promise.resolve(
              new SrvResponse(
                200,
                new HeaderList({
                  'content-type': MediaTypes.APPLICATION_JSON,
                  'x-id': req.$internals.id,
                  'x-verbose': String(modeIsAtLeast(ctx.config, 'verbose')),
                  'x-method': req.method,
                }),
                req.body,
              ),
            ),
          )
          .id('test-id'),
      )

      return Supertest($.listener())
        .post('/test')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual(body)
          expect(isUUID()(res.header['x-id']).pass).toBeTruthy()
          expect(res.header['x-verbose']).toEqual(String(true))
          expect(res.header['x-method']).toEqual('POST')
        })
    })
  })
})
