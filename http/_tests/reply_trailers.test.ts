import http from 'node:http'
import { Readable } from 'stream'
import { httpMock, opts, req, reply } from '../index.js'

describe('Trailers', function () {
  const $ = httpMock(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  test('trailers with text body', function (done) {
    $.mock(
      req
        .get('/test')
        .reply(reply.ok().text('hello world').header('test', 'ok').trailer('ETag', 'test-value')),
    )

    const u = $.serverInfo().http.baseUrl + '/test'

    http
      .get(u, res => {
        res.resume()
        res.on('end', () => {
          expect(res.headers.trailer).toEqual('etag')
          expect(res.trailers).toEqual({ etag: 'test-value' })
          expect(res.headers.test).toEqual('ok')

          done()
        })
      })
      .end()
  })

  test('trailers with no response body', function (done) {
    $.mock(req.get('/empty').reply(reply.ok().header('test', 'ok').trailer('ETag', 'test-value')))

    const u = $.serverInfo().http.baseUrl + '/empty'

    http
      .get(u, res => {
        res.resume()
        res.on('end', () => {
          expect(res.headers.trailer).toEqual('etag')
          expect(res.trailers).toEqual({ etag: 'test-value' })
          expect(res.headers.test).toEqual('ok')

          done()
        })
      })
      .end()
  })

  test('trailers with body stream', function (done) {
    function* data() {
      yield 'hello'
      yield 'world'
      yield ':)'
    }

    $.mock(
      req
        .get('/stream')
        .reply(
          reply.ok().header('test', 'ok').body(Readable.from(data())).trailer('ETag', 'test-value'),
        ),
    )

    const u = $.serverInfo().http.baseUrl + '/stream'

    http
      .get(u, res => {
        const data: string[] = []

        res.on('data', chunk => data.push(chunk))
        res.on('end', () => {
          const txt = data.join(' ').trim()

          expect(res.headers.trailer).toEqual('etag')
          expect(res.trailers).toEqual({ etag: 'test-value' })
          expect(res.headers.test).toEqual('ok')
          expect(txt).toEqual('hello world :)')

          done()
        })
      })
      .end()
  })
})
