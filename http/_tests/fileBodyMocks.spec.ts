import Path from 'path'
import Supertest from 'supertest'
import { H, MediaTypes } from '../http.js'
import { equalTo, get, opts, post, urlPath } from '../index.js'
import { ok } from '../mock/index.js'
import mockHttp from '../mockHttp.js'

describe('HTTP - Working With File Body Mocks', function () {
  describe('Default Path', function () {
    const $ = mockHttp(
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
          .header(H.Accept, equalTo(MediaTypes.APPLICATION_JSON))
          .reply(
            ok().bodyFile('body-stub.json').header(H.ContentType, MediaTypes.APPLICATION_JSON),
          ),
      )

      return Supertest($.listener())
        .get('/test')
        .set(H.Accept, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.context).toEqual('default-fixture-path'))
    })
  })

  describe('Local', function () {
    const $ = mockHttp(opts().dynamicHttpPort().mockDirectory(Path.join(__dirname, '_fixtures')))

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
          .header(H.Accept, equalTo(MediaTypes.APPLICATION_JSON))
          .reply(
            ok().bodyFile('body-stub.json').header(H.ContentType, MediaTypes.APPLICATION_JSON),
          ),
      )

      return Supertest($.listener())
        .get('/test')
        .set(H.Accept, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.context).toEqual('local-body-stub'))
    })
  })
})
