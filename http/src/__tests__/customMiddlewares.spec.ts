import { Response } from 'express'
import { NextFunction } from 'express'
import Supertest from 'supertest'
import { mockHttp } from '..'
import { opts } from '..'
import { HttpRequest } from '..'
import { get } from '..'
import { urlPath } from '..'
import { ok } from '..'
import { Headers } from '..'
import { MediaTypes } from '..'
import { created } from '..'
import { StatusCodes } from '..'

describe('Custom Middlewares', function () {
  function customMiddleware(req: HttpRequest, res: Response, next: NextFunction) {
    req.hello = 'world'
    next()
  }

  function customMiddlewareForRoute(req: HttpRequest, res: Response, next: NextFunction) {
    req.good = 'morning'
    next()
  }

  const $ = mockHttp(
    opts().dynamicHttpPort().trace().use(customMiddleware).use('/hey', customMiddlewareForRoute)
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.removeAll())

  describe('when providing a custom middleware without a specific route', function () {
    it('should apply it in all routes', function () {
      $.mock(
        get(urlPath('/test'))
          .expect((request: HttpRequest) => request.hello === 'world' && !request.good)
          .reply(ok())
      )

      return Supertest($.server())
        .get('/test')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(StatusCodes.OK)
    })
  })

  describe('when providing a custom middleware for a specific route', function () {
    it('should apply it in that specific route', async function () {
      $.mock(
        get(urlPath('/test'))
          .expect((request: HttpRequest) => request.hello === 'world' && !request.good)
          .reply(ok())
      )

      $.mock(
        get(urlPath('/hey'))
          .expect((request: HttpRequest) => request.hello === 'world' && request.good === 'morning')
          .reply(created())
      )

      await Supertest($.server())
        .get('/test')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(StatusCodes.OK)

      await Supertest($.server())
        .get('/hey')
        .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(StatusCodes.CREATED)
    })
  })
})
