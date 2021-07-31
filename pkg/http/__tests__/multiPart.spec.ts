import Path from 'path'
import Supertest from 'supertest'
import { mockrushHTTP, opts, post, urlPath } from '../index'
import { ok } from '../stub/initializers/ok'

describe('Form MultiPart', function () {
  const $ = mockrushHTTP(opts().dynamicPort().multiPartOptions({}))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

  it('should process multipart requests', async function () {
    const scope = $.mock(post(urlPath('/test')).reply(ok()))

    await Supertest($.server())
      .post('/test')
      .attach('text', Path.join(__dirname, '__fixtures__/mp-text.txt'))
      .attach('image', Path.join(__dirname, '__fixtures__/mp-logo.png'))
      .field('field-test-1', 'field-test-value')
      .expect(200)

    expect(scope.isDone()).toBeTruthy()
  }, 120000)
})
