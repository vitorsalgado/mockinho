import Path from 'path'
import Supertest from 'supertest'
import { equalTo, contains, field } from '@mockdog/matchers'
import { httpMock, opts, urlPath } from '../index.js'
import { fileContent } from '../feat/matchers'
import { post } from '../builder.js'
import { ok } from '../reply/index.js'

describe('Form MultiPart', function () {
  const $ = httpMock(opts().dynamicHttpPort())

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
        .fields(field('field-test-1', contains('test-value')))
        .fields(field('field-test-2', equalTo('field-test-value-2')))
        .reply(ok()),
    )

    await Supertest($.listener())
      .post('/test')
      .attach('text', Path.join(__dirname, '_fixtures/mp-text.txt'))
      .attach('image', Path.join(__dirname, '_fixtures/mp-logo.png'))
      .field('field-test-1', 'field-test-value-1')
      .field('field-test-2', 'field-test-value-2')
      .field('field-test-3', ['val1', 'val2'])
      .expect(200)

    expect(scope.hasBeenCalled()).toBeTruthy()
  }, 120000)
})
