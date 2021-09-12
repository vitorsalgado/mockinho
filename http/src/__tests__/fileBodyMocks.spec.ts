import Path from 'path'
import Supertest from 'supertest'
import { equalsTo, get, opts, post, urlPath } from '..'
import { ok } from '../mock'
import mockHttp from '../mockHttp'
import { MediaTypes } from '../MediaTypes'
import { Headers } from '../Headers'

describe('HTTP - Working With File Body Mocks', function () {
  describe('Default Path', function () {
    const $ = mockHttp(opts().dynamicHttpPort().trace().rootDir(Path.join(__dirname, '../../')))

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.resetMocks())

    it('should throw exception when mock does not exist', function () {
      $.mock(post(urlPath('/test')).reply(ok().bodyFile('nonexistent-body-stub.json')))

      return Supertest($.server()).post('/test').expect(500)
    })

    it('should use body mock located in the default directory', function () {
      $.mock(
        get(urlPath('/test'))
          .header(Headers.Accept, equalsTo(MediaTypes.APPLICATION_JSON))
          .reply(
            ok().bodyFile('body-stub.json').header(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          )
      )

      return Supertest($.server())
        .get('/test')
        .set(Headers.Accept, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.context).toEqual('default-fixture-path'))
    })
  })

  describe('Local', function () {
    const $ = mockHttp(opts().dynamicHttpPort().mockDirectory(Path.join(__dirname, '__fixtures__')))

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.resetMocks())

    it('should throw exception when mock does not exist', function () {
      $.mock(post(urlPath('/test')).reply(ok().bodyFile('nonexistent-body-stub.json')))

      return Supertest($.server()).post('/test').expect(500)
    })

    it('should use body mock located in the default directory', function () {
      $.mock(
        get(urlPath('/test'))
          .header(Headers.Accept, equalsTo(MediaTypes.APPLICATION_JSON))
          .reply(
            ok().bodyFile('body-stub.json').header(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          )
      )

      return Supertest($.server())
        .get('/test')
        .set(Headers.Accept, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.context).toEqual('local-body-stub'))
    })
  })
})
