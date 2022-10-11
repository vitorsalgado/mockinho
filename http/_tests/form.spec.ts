import Supertest from 'supertest'
import { allOf, contains, equalTo, field, hasLength, item } from '@mockdog/matchers'
import { H, MediaTypes } from '../http.js'
import { opts, post, urlPath } from '../index.js'
import { httpMock } from '../index.js'
import { ok } from '../mock/reply/index.js'

describe('HTTP - Form Url Encoded', function () {
  const $ = httpMock(opts().dynamicHttpPort().formUrlEncodedOptions({ limit: 80 }))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should accept form-url-encoded requests', function () {
    $.mock(
      post(urlPath('/test'))
        .header('content-type', equalTo(MediaTypes.APPLICATION_FORM_URL_ENCODED))
        .requestBody(
          allOf(
            field('name', equalTo('the name')),
            field('description', equalTo('some description')),
            field('age', equalTo('32')),
            field('job', hasLength(2)),
            field('job', item(0, contains('tea'))),
            field('job', item(1, equalTo('developer'))),
          ),
        )
        .reply(ok().body('done')),
    )

    return Supertest($.listener())
      .post('/test?q=term')
      .set(H.ContentType, MediaTypes.APPLICATION_FORM_URL_ENCODED)
      .send('name=the+name&description=some+description&age=32&job=teacher&job=developer')
      .expect(200)
      .expect(res => expect(res.text).toEqual('done'))
  })

  it('should fail if it exceeds the body limit', function () {
    $.mock(
      post(urlPath('/test'))
        .header('content-type', equalTo(MediaTypes.APPLICATION_FORM_URL_ENCODED))
        .reply(ok().body('done')),
    )

    return Supertest($.listener())
      .post('/test?q=term')
      .set(H.ContentType, MediaTypes.APPLICATION_FORM_URL_ENCODED)
      .send(
        'name=the+name&description=some+description&age=32&job=teacher&job=developer&other=super-failure-test',
      )
      .expect(413)
  })
})
