import { fromFile } from '@mockinho/core-bodyconverters'
import { containing, equalsTo, jsonPath, not } from '@mockinho/core-matchers'
import * as Path from 'path'
import Supertest from 'supertest'
import { opts } from '../config'
import { get, mockinhoHTTP } from '../index'
import { urlPath } from '../matchers'
import { ok, okJSON, post } from '../stub'
import { Headers, MediaTypes } from '../types'

const fixture = (name: string) => Path.join(__dirname, `__fixtures__/__content__${name}`)

describe.skip('Mockinho HTTP', function () {
  const $ = mockinhoHTTP(opts().dynamicPort().trace())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

  describe('GET', function () {
    it('should mock a GET request and return json body with 200 (OK)', function () {
      const expected = 'test ok'

      $.mock(
        get(urlPath('/test'))
          .header('content-type', containing('json'))
          .reply(okJSON({ data: expected }))
      )

      return Supertest($.server())
        .get('/test?q=term')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual(expected))
    })

    it('should mock a GET request and return json body with 200 (OK) from stub file', function () {
      const expected = 'test ok'

      // $.mock(
      //   buildStubFromFile(
      //     JSON.parse(Fs.readFileSync(Path.join(__dirname, '__fixtures__/stub.json')).toString())
      //   )
      // )

      return Supertest($.server())
        .get('/test')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual(expected))
    })
  })

  describe('POST', function () {
    it('should mock a POST request with json body matching field name value', function () {
      $.mock(
        post(urlPath('/test'))
          .header('content-type', containing('json'))
          .requestBody(jsonPath('user.name', equalsTo('tester')))
          .reply(ok().body('done').header(Headers.ContentType, MediaTypes.TEXT_PLAIN))
      )

      return Supertest($.server())
        .post('/test?q=term')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .send({ user: { name: 'tester' }, address: { street: 'street A' }, age: 50 })
        .expect(200)
        .expect(res => expect(res.text).toEqual('done'))
    })

    it('should mock response body from file stream', function () {
      $.mock(
        post(urlPath('/test')).reply(
          ok()
            .body(fromFile(fixture('simple.json')))
            .header(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        )
      )

      return Supertest($.server())
        .post('/test')
        .expect(200)
        .expect(res => expect(res.body.data.status).toEqual('OK'))
    })
  })

  describe('Scenarios', function () {
    it('should mock requests according to scenarios and fail when state is not valid', async function () {
      const expected = 'test-expected-value'

      $.mock(
        post(urlPath('/test'))
          .name('Stub 1')
          .scenario('Test', 'started', 'phase 2')
          .header('content', not(containing('test')))
          .requestBody(jsonPath('message', equalsTo('success')))
          .reply(okJSON({ data: expected }))
      )

      $.mock(
        post(containing('/test'))
          .name('Stub 2')
          .hitTimes(1)
          .header('content', not(containing('test')))
          .requestBody(jsonPath('message', equalsTo('success')))
          .scenario('Test', 'phase 2', 'phase 3')
          .reply(okJSON({ data: 'phase 2' }))
      )

      await Supertest($.server())
        .post('/test?q=term')
        .set('content', 'nothing')
        .send({ message: 'success' })
        .expect(200)
        .expect(res => expect(res.body.data).toEqual(expected))

      await Supertest($.server())
        .post('/test')
        .set('content', 'nothing')
        .send({ message: 'success' })
        .expect(200)
        .expect(res => expect(res.body.data).toEqual('phase 2'))

      await Supertest($.server())
        .get('/')
        .set('content', 'nothing')
        .expect(500)
        .expect(({ body }) => expect(body.error).toEqual('No stub found!'))
    })
  })

  describe('Request Limit', function () {
    it('should not mock a request after the stub hit limit passed', async function () {
      const expected = 'test ok'

      $.mock(
        get(urlPath('/test'))
          .header('content-type', containing('json'))
          .query('qs', containing('nothing'))
          .hitTimes(1)
          .reply(okJSON({ data: expected }))
      )

      await Supertest($.server())
        .get('/test?q=term')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual(expected))

      await Supertest($.server())
        .get('/test?q=term')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(500)
    })
  })

  it('test', () => {
    expect('test').toEqual('no test')
  })
})
