import Path from 'path'
import Supertest from 'supertest'
import { contains } from '@mockdog/matchers'
import { get, H, MediaTypes, ok, opts, urlPath } from '../index.js'
import { created } from '../index.js'
import { badRequest } from '../index.js'
import { SC } from '../index.js'
import { mockHttp } from '../index.js'
import { sequence } from '../mock/seq.js'

describe('Responses', function () {
  const $ = mockHttp(
    opts()
      .dynamicHttpPort()
      .trace()
      .enableFileMocks()
      .mockDirectory(Path.join(__dirname, '_fixtures')),
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks('code'))

  describe('when using .bodyWith()', function () {
    it('should be able to build response using request values', function () {
      $.mock(
        get(urlPath('/test'))
          .header('content-type', contains('json'))
          .reply(ok().bodyWith(request => ({ data: `Request method was: ${request.method}` }))),
      )

      return Supertest($.listener())
        .get('/test?q=term')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual('Request method was: GET'))
    })
  })

  describe('when using multiple responses', function () {
    it('should use response based on request number', async function () {
      $.mock(get(urlPath('/test')).reply(sequence().add(ok(), created(), badRequest())))

      await Supertest($.listener()).get('/test').expect(SC.OK)
      await Supertest($.listener()).get('/test').expect(SC.Created)
      await Supertest($.listener()).get('/test').expect(SC.BadRequest)

      await Supertest($.listener())
        .get('/test')
        .expect(SC.TeaPot)
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
          .expect(res => res.status === SC.OK || SC.BadRequest)
      }
    })

    it('should set sequential multiple responses based on file configuration', async function () {
      await Supertest($.listener()).get('/test/sequential').expect(SC.OK)
      await Supertest($.listener()).get('/test/sequential').expect(SC.BadRequest)
    })
  })
})
