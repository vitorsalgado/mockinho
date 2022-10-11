import Supertest from 'supertest'
import { equalTo } from '@mockdog/matchers'
import { opts } from '../config/index.js'
import { httpMock } from '../index.js'
import { urlPath } from '../feat/matchers/index.js'
import { get } from '../builder.js'
import { ok } from '../reply/index.js'

describe('querystring', function () {
  const $ = httpMock(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should accept form-url-encoded requests', function () {
    $.mock(get(urlPath('/test')).query('greetings', equalTo('hello')).reply(ok().body('done')))

    return Supertest($.listener())
      .get('/test?greetings=hello')
      .expect(200)
      .expect(res => expect(res.text).toEqual('done'))
  })
})
