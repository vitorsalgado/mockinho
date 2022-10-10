import Path from 'path'
import Supertest from 'supertest'
import { opts } from '../../../../config'
import mockHttp from '../../../../mockHttp'

describe('Templating File Mock', function () {
  const $ = mockHttp(
    opts()
      .dynamicHttpPort()
      .enableFileMocks()
      .mockDirectory(Path.join(__dirname, '_fixtures', 'templating')),
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())

  it('should use template body from file when using "bodyTemplateFile" property', function () {
    return Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({ title: 'Test Model', size: 100, mode: 'test' })
        expect(res.headers.method).toEqual('GET')
        expect(res.headers.env).toEqual('TEST')
      })
  })

  it('should use template body mock definition when using "bodyTemplate" property', function () {
    return Supertest($.listener())
      .get('/test/inline')
      .expect(200)
      .expect(res => {
        expect(res.text).toEqual('Title is: Test Model\nMode is: test')
        expect(res.headers.method).toEqual('GET')
      })
  })
})
