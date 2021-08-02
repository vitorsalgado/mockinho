import Supertest from 'supertest'
import { containing } from '@mockinho/core-matchers'
import { mockinhoHTTP, opts, get, urlPath, Headers, MediaTypes, ok } from '..'

describe('Responses', function () {
  const $ = mockinhoHTTP(opts().dynamicPort().trace())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

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
