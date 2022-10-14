import Supertest from 'supertest'
import fetch from 'node-fetch'
import { opts } from '../config/index.js'
import { get, httpMock, SC } from '../index.js'

describe('Providing Replies', function () {
  const $ = httpMock(opts().dynamicHttpPort())

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('when providing a number and no body', function () {
    it('should use the given status and return no body', function () {
      $.mock(get('/test').reply(SC.NoContent))

      return Supertest($.listener()).get('/test').expect(SC.NoContent)
    })
  })

  describe('when providing a number and a body', function () {
    it('should return a response with both', function () {
      $.mock(get('/test').reply(200, 'test'))

      return Supertest($.listener())
        .get('/test')
        .expect(SC.OK)
        .expect(res => expect(res.text).toEqual('test'))
    })
  })

  describe('when providing a function to reply', function () {
    describe('and the function returns a void', function () {
      it('should configure the response mock', function () {
        $.mock(
          get('/test').reply(async (req, res, ctx) => {
            res
              .status(SC.Created)
              .contentType('text')
              .send(`got ${req.header('x-test')}`)
          }),
        )

        const val = 'hello'

        return Supertest($.listener())
          .get('/test')
          .set('x-test', val)
          .expect(SC.Created)
          .expect(res => {
            expect(res.header['content-type']).toContain('text/plain')
            expect(res.text).toEqual(`got ${val}`)
          })
      })
    })

    describe('and the function returns a promise', function () {
      it('should configure the response mock', function () {
        $.mock(get('/value').reply(200, 'hello world'))

        $.mock(
          get('/test').reply(async (req, res, ctx) => {
            const u = $.info.http.url
            const txt = await fetch(`${u}/value`).then(res => res.text())

            res.status(SC.Created).contentType('text').send(txt)
          }),
        )

        return Supertest($.listener())
          .get('/test')
          .expect(SC.Created)
          .expect(res => {
            expect(res.header['content-type']).toContain('text/plain')
            expect(res.text).toEqual('hello world')
          })
      })
    })
  })
})
