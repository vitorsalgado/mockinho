import Supertest from 'supertest'
import { httpMock, opts, reply, req } from '../index.js'

describe('Reply', function () {
  const $ = httpMock(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  test('set status and status message', () => {
    $.mock(req.get('/test').reply(reply.ok().statusMessage('HEY')))

    return Supertest($.listener())
      .get('/test')
      .expect(res => {
        expect((res as any).res.statusMessage).toEqual('HEY')
      })
  })
})
