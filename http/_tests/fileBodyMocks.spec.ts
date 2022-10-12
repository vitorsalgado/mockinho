import Path from 'path'
import Supertest from 'supertest'
import { equalTo } from '@mockdog/matchers'
import { H, Media } from '../http.js'
import { httpMock, opts, urlPath } from '../index.js'
import { get, post } from '../builder.js'
import { ok } from '../reply/index.js'

describe('HTTP - Working With File Body Mocks', function () {
  describe('Default Path', function () {
    const $ = httpMock(
      opts().dynamicHttpPort().trace().rootDir(Path.join(__dirname, './_fixtures/file_mocks_test')),
    )

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.resetMocks())

    it('should throw exception when mock does not exist', function () {
      $.mock(post(urlPath('/test')).reply(ok().bodyFile('nonexistent-body-stub.json')))

      return Supertest($.listener()).post('/test').expect(500)
    })

    it('should use body mock located in the default directory', function () {
      $.mock(
        get(urlPath('/test'))
          .header(H.Accept, equalTo(Media.JSON))
          .reply(ok().bodyFile('body-stub.json').header(H.ContentType, Media.JSON)),
      )

      return Supertest($.listener())
        .get('/test')
        .set(H.Accept, Media.JSON)
        .expect(200)
        .expect(res => expect(res.body.context).toEqual('default-fixture-path'))
    })
  })

  describe('Local', function () {
    const $ = httpMock(opts().dynamicHttpPort().mockDirectory(Path.join(__dirname, '_fixtures')))

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.resetMocks())

    it('should throw exception when mock does not exist', function () {
      $.mock(post(urlPath('/test')).reply(ok().bodyFile('nonexistent-body-stub.json')))

      return Supertest($.listener()).post('/test').expect(500)
    })

    it('should use body mock located in the default directory', function () {
      $.mock(
        get(urlPath('/test'))
          .header(H.Accept, equalTo(Media.JSON))
          .reply(ok().bodyFile('body-stub.json').header(H.ContentType, Media.JSON)),
      )

      return Supertest($.listener())
        .get('/test')
        .set(H.Accept, Media.JSON)
        .expect(200)
        .expect(res => expect(res.body.context).toEqual('local-body-stub'))
    })
  })
})
