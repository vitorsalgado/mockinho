import Path from 'path'
import Supertest from 'supertest'
import { containing } from '@mockinho/core-matchers'
import { opts, get, urlPath, Headers, MediaTypes, ok } from '..'
import mockaccinoHttp from '..'
import { created } from '..'
import { badRequest } from '..'
import { StatusCodes } from '..'
import { multipleResponses } from '../mock/entry/multipleResponses'

describe('Responses', function () {
  const $ = mockaccinoHttp(
    opts()
      .dynamicHttpPort()
      .trace()
      .loadMocks()
      .mocksDirectory(Path.join(__dirname, '__fixtures__'))
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanMocksBySource('code'))

  describe('when using .bodyWith()', function () {
    it('should be able to build response using request values', function () {
      $.mock(
        get(urlPath('/test'))
          .header('content-type', containing('json'))
          .reply(ok().bodyWith(request => ({ data: `Request method was: ${request.method}` })))
      )

      return Supertest($.server())
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

      await Supertest($.server()).get('/test').expect(StatusCodes.OK)
      await Supertest($.server()).get('/test').expect(StatusCodes.CREATED)
      await Supertest($.server()).get('/test').expect(StatusCodes.BAD_REQUEST)

      await Supertest($.server())
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
        await Supertest($.server())
          .get('/test/random')
          .expect(res => res.status === StatusCodes.OK || StatusCodes.BAD_REQUEST)
      }
    })

    it('should set sequential multiple responses based on file configuration', async function () {
      await Supertest($.server()).get('/test/sequential').expect(StatusCodes.OK)
      await Supertest($.server()).get('/test/sequential').expect(StatusCodes.BAD_REQUEST)
    })

    describe('when .returnErrorOnNoResponse() is false', function () {
      it('should return the first route on collection', async function () {
        await Supertest($.server()).get('/test/sequential/error-no-response').expect(StatusCodes.OK)

        await Supertest($.server()).get('/test/sequential/error-no-response').expect(StatusCodes.OK)
        await Supertest($.server()).get('/test/sequential/error-no-response').expect(StatusCodes.OK)
      })
    })
  })
})
