import Path from 'path'
import Supertest from 'supertest'
import { equalsTo, containing, jsonPath } from '@mockinho/core-matchers'
import { mockinhoHTTP, opts, post, urlPath } from '..'
import { ok } from '../stub'
import { fileContent } from '../matchers/fileContent'
import { fieldPath } from '../matchers/fieldPath'

describe('Form MultiPart', function () {
  const $ = mockinhoHTTP(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

  it('should process multipart requests', async function () {
    const scope = $.mock(
      post(urlPath('/test'))
        .file('text', fileContent(equalsTo('Hello World\n')))
        .files(files => files.some(x => x.mimetype.includes('png')))
        .files(
          files => files.some(x => x.fieldname.includes('image')),
          files => files.length === 2
        )
        .requestFields(fieldPath('field-test-1', containing('test-value')))
        .requestFields(jsonPath('field-test-2', equalsTo('field-test-value-2')))
        .reply(ok())
    )

    await Supertest($.server())
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
