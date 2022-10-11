import Path from 'path'
import Supertest from 'supertest'
import { contains } from '@mockdog/matchers'
import { H, MediaTypes, opts, urlPath } from '../index.js'
import { httpMock } from '../index.js'
import { get } from '../mock_builder.js'
import { ok } from './replies.js'

describe('Responses', function () {
  const $ = httpMock(
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
          .reply(ok().bodyFn(request => ({ data: `Request method was: ${request.method}` }))),
      )

      return Supertest($.listener())
        .get('/test?q=term')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual('Request method was: GET'))
    })
  })
})
