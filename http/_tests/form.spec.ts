import Supertest from 'supertest'
import { hasLength } from '@mockdog/matchers'
import { Headers, MediaTypes } from '../http.js'
import { allOf, contains, equalsTo, item, field, opts, post, urlPath } from '../index.js'
import { mockHttp } from '../index.js'
import { ok } from '../mock'

describe('HTTP - Form Url Encoded', function () {
  const $ = mockHttp(opts().dynamicHttpPort().formUrlEncodedOptions({ limit: 80 }))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should accept form-url-encoded requests', function () {
    $.mock(
      post(urlPath('/test'))
        .header('content-type', equalsTo(MediaTypes.APPLICATION_FORM_URL_ENCODED))
        .requestBody(
          allOf(
            field('name', equalsTo('the name')),
            field('description', equalsTo('some description')),
            field('age', equalsTo('32')),
            field('job', hasLength(2)),
            field('job', item(0, contains('tea'))),
            field('job', item(1, equalsTo('developer'))),
          ),
        )
        .reply(ok().body('done')),
    )

    return Supertest($.listener())
      .post('/test?q=term')
      .set(Headers.ContentType, MediaTypes.APPLICATION_FORM_URL_ENCODED)
      .send('name=the+name&description=some+description&age=32&job=teacher&job=developer')
      .expect(200)
      .expect(res => expect(res.text).toEqual('done'))
  })

  it('should fail if it exceeds the body limit', function () {
    $.mock(
      post(urlPath('/test'))
        .header('content-type', equalsTo(MediaTypes.APPLICATION_FORM_URL_ENCODED))
        .reply(ok().body('done')),
    )

    return Supertest($.listener())
      .post('/test?q=term')
      .set(Headers.ContentType, MediaTypes.APPLICATION_FORM_URL_ENCODED)
      .send(
        'name=the+name&description=some+description&age=32&job=teacher&job=developer&other=super-failure-test',
      )
      .expect(413)
  })
})
