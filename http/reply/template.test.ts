import Path from 'path'
import Supertest from 'supertest'
import { H, MediaTypes } from '../http.js'
import httpMock, { get } from '../index.js'
import { opts } from '../config/index.js'
import { ok } from './replies.js'

describe('Templating', function () {
  const $ = httpMock(opts().dynamicHttpPort().enableFileMocks(false))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should return response body with parsed template when input is a string', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.PlainText)
          .model({ testLib: 'Jest!' })
          .helpers({ toUpper: (value: string) => value.toUpperCase() })
          .bodyTemplate('this is a test using: {{toUpper model.testLib}}'),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response => expect(response.text).toEqual('this is a test using: JEST!'))
  })

  it('should return response object with fields parsed when input is a string', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.JSON)
          .model({ testLib: 'Jest!' })
          .helpers({ toLower: (value: string) => value.toLowerCase() })
          .bodyTemplate('{ "testLib": "{{toLower model.testLib}}" }'),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response => expect(response.body).toEqual({ testLib: 'jest!' }))
  })

  it('should return response object with fields parsed when input is also a object', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.JSON)
          .model({ testLib: 'Jest!' })
          .helpers({ toLower: (value: string) => value.toLowerCase() })
          .bodyTemplate({ testLib: '{{toLower model.testLib}}' }),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response => expect(response.body).toEqual({ testLib: 'jest!' }))
  })

  it('should use values from env', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.PlainText)
          .bodyTemplate('NODE_ENV is: {{model.env.NODE_ENV}}')
          .model({
            env: {
              NODE_ENV: 'test',
            },
          }),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response => expect(response.text).toEqual('NODE_ENV is: test'))
  })

  it('should use values from request', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.PlainText)
          .bodyTemplate('Method is: {{request.method}}'),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response => expect(response.text).toEqual('Method is: GET'))
  })

  it('should return response body with parsed template when providing a path to a template', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.PlainText)
          .model({
            title: 'Test Template File',
            env: {
              NODE_ENV: 'test',
            },
          })
          .helpers({ toUpper: (value: string) => value.toUpperCase() })
          .bodyTemplatePath(Path.join(__dirname, '_fixtures', 'template.txt')),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response =>
        expect(response.text).toEqual(
          'Title: Test Template File\n' + 'Mode: TEST\n' + 'Request Is: GET\n',
        ),
      )
  })

  it('should respond header with content parsed when using a template value', async function () {
    $.mock(
      get('/test').reply(
        ok()
          .header(H.ContentType, MediaTypes.JSON)
          .headerTemplate('x-id', '{{request.id}}')
          .bodyFn(request => ({
            id: request.$internals.id,
          })),
      ),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(response => expect(response.body.id).toBeDefined())
      .expect(response => expect(response.headers['x-id']).toEqual(response.body.id))
  })
})
