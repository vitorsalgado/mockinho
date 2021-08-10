import Path from 'path'
import Supertest from 'supertest'
import { equalsTo, get, mockinhoHTTP, opts, post, urlPath } from '..'
import { ok } from '../stub'
import { Headers, MediaTypes } from '../types'

describe('HTTP - Working With File Body Stubs', function () {
  describe('Default Path', function () {
    const $ = mockinhoHTTP(
      opts().dynamicHttpPort().verbose().rootDir(Path.join(__dirname, '../../'))
    )

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.cleanAll())

    it('should throw exception when stub does not exist', function () {
      expect(() =>
        $.mock(post(urlPath('/test')).reply(ok().bodyFile('nonexistent-body-stub.json')))
      ).toThrow()
    })

    it('should use body stub located in the default directory', function () {
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
    const $ = mockinhoHTTP(
      opts().dynamicHttpPort().stubsDirectory(Path.join(__dirname, '__fixtures__'))
    )

    beforeAll(() => $.start())
    afterAll(() => $.finalize())
    afterEach(() => $.cleanAll())

    it('should throw exception when stub does not exist', function () {
      expect(() =>
        $.mock(post(urlPath('/test')).reply(ok().bodyFile('nonexistent-body-stub.json')))
      ).toThrow()
    })

    it('should use body stub located in the default directory', function () {
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
