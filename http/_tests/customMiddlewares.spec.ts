import { Response } from 'express'
import { NextFunction } from 'express'
import Supertest from 'supertest'
import { mockHttp } from '../index.js'
import { opts } from '../index.js'
import { SrvRequest } from '../index.js'
import { get } from '../index.js'
import { urlPath } from '../index.js'
import { ok } from '../index.js'
import { H } from '../index.js'
import { MediaTypes } from '../index.js'
import { created } from '../index.js'
import { SC } from '../index.js'

describe('Custom Middlewares', function () {
  function customMiddleware(req: SrvRequest, res: Response, next: NextFunction) {
    req.hello = 'world'
    next()
  }

  function customMiddlewareForRoute(req: SrvRequest, res: Response, next: NextFunction) {
    req.good = 'morning'
    next()
  }

  const $ = mockHttp(
    opts().dynamicHttpPort().trace().use(customMiddleware).use('/hey', customMiddlewareForRoute),
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('when providing a custom middleware without a specific route', function () {
    it('should apply it in all routes', function () {
      $.mock(
        get(urlPath('/test'))
          .expect((request: SrvRequest) => request.hello === 'world' && !request.good)
          .reply(ok()),
      )

      return Supertest($.listener())
        .get('/test')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(SC.OK)
    })
  })

  describe('when providing a custom middleware for a specific route', function () {
    it('should apply it in that specific route', async function () {
      $.mock(
        get(urlPath('/test'))
          .expect((request: SrvRequest) => request.hello === 'world' && !request.good)
          .reply(ok()),
      )

      $.mock(
        get(urlPath('/hey'))
          .expect((request: SrvRequest) => request.hello === 'world' && request.good === 'morning')
          .reply(created()),
      )

      await Supertest($.listener())
        .get('/test')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(SC.OK)

      await Supertest($.listener())
        .get('/hey')
        .set(H.ContentType, MediaTypes.APPLICATION_JSON)
        .expect(SC.Created)
    })
  })
})
