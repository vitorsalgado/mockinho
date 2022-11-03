import Supertest from 'supertest'
import { allOf, contains, equalTo, field, hasLength, item } from '@mockdog/matchers'
import { H, httpMock, Media, opts, post, urlPath } from '../index.js'
import { ok } from '../reply/index.js'

describe('request - json matching', function () {
  const $ = httpMock(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should ', function () {
    $.mock(
      post(urlPath('/test'))
        .requestBody(
          allOf(
            field('name', equalTo('the name')),
            field('age', equalTo(34)),
            field('job', hasLength(2)),
            field('job', item(0, contains('dev'))),
            field('job', item(1, equalTo('qa'))),
            field('address.country', equalTo('brasil')),
            field('job[1]', equalTo('qa')),
          ),
        )
        .reply(ok().body('done')),
    )

    return Supertest($.listener())
      .post('/test?q=term')
      .set(H.ContentType, Media.JSON)
      .send({ name: 'the name', age: 34, job: ['dev', 'qa'], address: { country: 'brasil' } })
      .expect(200)
      .expect(res => expect(res.text).toEqual('done'))
  })
})
