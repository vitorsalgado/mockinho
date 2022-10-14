import * as Path from 'path'
import Supertest from 'supertest'
import { contains, equalTo, field } from '@mockdog/matchers'
import { fromFile } from '@mockdog/x'
import { H, Media } from '../http.js'
import { httpMock } from '../index.js'
import { urlPath } from '../feat/matchers/index.js'
import { opts } from '../config/index.js'
import { get, post } from '../builder.js'
import { ok, okJSON } from '../reply/index.js'
import { AppVars } from '../_internal/vars.js'

const fixture = (name: string) => Path.join(__dirname, `_fixtures/__content__${name}`)

describe('MockDog HTTP', function () {
  const $ = httpMock(opts().dynamicHttpPort().trace())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('GET', function () {
    it('should mock a GET request and return json body with 200 (OK)', function () {
      const expected = 'test ok'

      $.mock(
        get(urlPath('/test'))
          .header('content-type', contains('json'))
          .reply(okJSON({ data: expected })),
      )

      return Supertest($.listener())
        .get('/test?q=term')
        .set(H.ContentType, Media.JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual(expected))
    })

    it.skip('should mock a GET request and return json body with 200 (OK) from mock file', function () {
      const expected = 'test ok'

      // $.mock(
      //   buildStubFromFile(
      //     JSON.parse(Fs.readFileSync(Path.join(__dirname, '_fixtures/stub.json')).toString())
      //   )
      // )

      return Supertest($.listener())
        .get('/test')
        .set(H.ContentType, Media.JSON)
        .expect(200)
        .expect(res => expect(res.body.data).toEqual(expected))
    })
  })

  describe('POST', function () {
    it('should mock a POST request with json body matching field name value', function () {
      $.mock(
        post(urlPath('/test'))
          .header('content-type', contains('json'))
          .requestBody(field('user.name', equalTo('tester')))
          .reply(ok().body('done').header(H.ContentType, Media.PlainText)),
      )

      return Supertest($.listener())
        .post('/test?q=term')
        .set(H.ContentType, Media.JSON)
        .send({ user: { name: 'tester' }, address: { street: 'street A' }, age: 50 })
        .expect(200)
        .expect(res => expect(res.text).toEqual('done'))
    })

    it.skip('should mock response body from file stream', function () {
      $.mock(
        post(urlPath('/test')).reply(
          ok()
            .body(fromFile(fixture('simple.json')))
            .header(H.ContentType, Media.JSON),
        ),
      )

      return Supertest($.listener())
        .post('/test')
        .expect(200)
        .expect(res => expect(res.body.data.status).toEqual('OK'))
    })
  })

  describe('Scenarios', function () {
    it('should mock requests according to scenarios and fail when state is not valid', async function () {
      $.mock(
        post(urlPath('/test'))
          .name('Stub 1')
          .scenario('Test', 'started', 'phase 2')
          .header(H.ContentType, contains('json'))
          .requestBody(field('message', equalTo('hey')))
          .reply(okJSON({ data: 'started' })),
      )

      $.mock(
        post(urlPath('/test'))
          .name('Stub 2')
          .scenario('Test', 'phase 2', 'phase 3')
          .header(H.ContentType, contains('json'))
          .requestBody(field('message', equalTo('hey')))
          .reply(okJSON({ data: 'phase 2' })),
      )

      await Supertest($.listener())
        .post('/test')
        .set('content', 'nothing')
        .set(H.ContentType, Media.JSON)
        .send({ message: 'hey' })
        .expect(200)
        .expect(res => expect(res.body.data).toEqual('started'))

      await Supertest($.listener())
        .post('/test')
        .set(H.ContentType, Media.JSON)
        .set('content', 'nothing')
        .send({ message: 'hey' })
        .expect(200)
        .expect(res => expect(res.body.data).toEqual('phase 2'))

      await Supertest($.listener()).post('/').expect(AppVars.NoMatchStatus)
    })
  })
})
