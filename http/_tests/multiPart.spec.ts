import Path from 'path'
import Supertest from 'supertest'
import { equalTo, contains, field } from '@mockdog/matchers'
import { opts, post, urlPath } from '../index.js'
import { mockHttp } from '../mockHttp.js'
import { ok } from '../mock/index.js'
import { fileContent } from '../matchers'

describe('Form MultiPart', function () {
  const $ = mockHttp(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should process multipart requests', async function () {
    const scope = $.mock(
      post(urlPath('/test'))
        .file('text', fileContent(equalTo('Hello World\n')))
        .files(files => files.some(x => x.mimetype.includes('png')))
        .files(
          files => files.some(x => x.fieldname.includes('image')),
          files => files.length === 2,
        )
        .requestFields(field('field-test-1', contains('test-value')))
        .requestFields(field('field-test-2', equalTo('field-test-value-2')))
        .reply(ok()),
    )

    await Supertest($.listener())
      .post('/test')
      .attach('text', Path.join(__dirname, '__fixtures__/mp-text.txt'))
      .attach('image', Path.join(__dirname, '__fixtures__/mp-logo.png'))
      .field('field-test-1', 'field-test-value-1')
      .field('field-test-2', 'field-test-value-2')
      .field('field-test-3', ['val1', 'val2'])
      .expect(200)

    expect(scope.isDone()).toBeTruthy()
  }, 120000)
})