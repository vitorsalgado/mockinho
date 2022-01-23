import Path from 'path'
import Supertest from 'supertest'
import { contains } from '@mockdog/core-matchers'
import { get, Headers, MediaTypes, ok, opts, urlPath } from '../index.js'
import { created } from '../index.js'
import { badRequest } from '../index.js'
import { StatusCodes } from '../index.js'
import { mockHttp } from '../index.js'
import { multipleResponses } from '../mock/entry/multipleResponses'

describe('Responses', function () {
  const $ = mockHttp(
    opts()
      .dynamicHttpPort()
      .trace()
      .enableFileMocks()
      .mockDirectory(Path.join(__dirname, '__fixtures__'))
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks('code'))

  describe('when using .bodyWith()', function () {
    it('should be able to build response using request values', function () {
      $.mock(
        get(urlPath('/test'))
          .header('content-type', contains('json'))
          .reply(ok().bodyWith(request => ({ data: `Request method was: ${request.method}` })))
      )

      return Supertest($.listener())
        .get('/test?q=term')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual('Request method was: GET'))
    })
  })

  describe('when using multiple responses', function () {
    it('should use response based on request number', async function () {
      $.mock(
        get(urlPath('/test')).reply(
          multipleResponses().type('sequential').add(ok(), created(), badRequest())
        )
      )

      await Supertest($.listener()).get('/test').expect(StatusCodes.OK)
      await Supertest($.listener()).get('/test').expect(StatusCodes.CREATED)
      await Supertest($.listener()).get('/test').expect(StatusCodes.BAD_REQUEST)

      await Supertest($.listener())
        .get('/test')
        .expect(StatusCodes.INTERNAL_SERVER_ERROR)
        .expect(res => res.header['content-type'].includes('text/plain'))
    })

    it('should set random multiple responses based on file configuration', async function () {
      function* count() {
        yield 0
        yield 1
        yield 2
        yield 3
        yield 4
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of count()) {
        await Supertest($.listener())
          .get('/test/random')
          .expect(res => res.status === StatusCodes.OK || StatusCodes.BAD_REQUEST)
      }
    })

    it('should set sequential multiple responses based on file configuration', async function () {
      await Supertest($.listener()).get('/test/sequential').expect(StatusCodes.OK)
      await Supertest($.listener()).get('/test/sequential').expect(StatusCodes.BAD_REQUEST)
    })

    describe('when .returnErrorOnNoResponse() is false', function () {
      it('should return the first route on collection', async function () {
        await Supertest($.listener())
          .get('/test/sequential/error-no-response')
          .expect(StatusCodes.OK)

        await Supertest($.listener())
          .get('/test/sequential/error-no-response')
          .expect(StatusCodes.OK)
        await Supertest($.listener())
          .get('/test/sequential/error-no-response')
          .expect(StatusCodes.OK)
      })
    })
  })
})
