import { Readable } from 'stream'
import Supertest from 'supertest'
import { httpMock, opts, req } from '../index.js'

describe('Reply Stream', function () {
  const $ = httpMock(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('should ', function () {
    function* data() {
      yield 'hello'
      yield 'world'
      yield ':)'
    }

    const stream = Readable.from(data())

    $.mock(req.get('/test').reply(200, stream))

    return Supertest($.listener())
      .get('/test')
      .expect(res => {
        expect(res).toBeDefined()
      })
  })
})
