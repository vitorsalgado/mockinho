import Path from 'path'
import Supertest from 'supertest'
import { opts } from '../../config/index.js'
import { SC } from '../../http.js'
import httpMock from '../../index.js'

describe('Random Responses', function () {
  const $ = httpMock(
    opts()
      .dynamicHttpPort()
      .trace()
      .enableFileMocks()
      .mockDirectory(Path.join(__dirname, '_fixtures')),
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks('code'))

  it('should set random multiple responses based on file configuration', async function () {
    function* count() {
      yield 0
      yield 1
      yield 2
      yield 3
      yield 4
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _ of count()) {
      await Supertest($.listener())
        .get('/test/random')
        .expect(res => res.status === SC.OK || SC.BadRequest)
    }
  })
})
