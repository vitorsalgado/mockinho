import Path from 'path'
import Supertest from 'supertest'
import { opts } from '../config/index.js'
import { SC } from '../http.js'
import httpMock, { urlPath } from '../index.js'
import { get } from '../mock_builder.js'
import { badRequest, created, ok } from './replies.js'
import { sequence } from './sequence.js'

describe('Responses In Sequence', function () {
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

  it('should use response based on request number', async function () {
    $.mock(get(urlPath('/test')).reply(sequence().add(ok(), created(), badRequest())))

    await Supertest($.listener()).get('/test').expect(SC.OK)
    await Supertest($.listener()).get('/test').expect(SC.Created)
    await Supertest($.listener()).get('/test').expect(SC.BadRequest)

    await Supertest($.listener())
      .get('/test')
      .expect(SC.TeaPot)
      .expect(res => res.header['content-type'].includes('text/plain'))
  })

  it('should set sequential multiple responses based on file configuration', async function () {
    await Supertest($.listener()).get('/test/sequential').expect(SC.OK)
    await Supertest($.listener()).get('/test/sequential').expect(SC.BadRequest)
  })
})
