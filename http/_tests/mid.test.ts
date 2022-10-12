import { Response } from 'express'
import { NextFunction } from 'express'
import Supertest from 'supertest'
import { httpMock } from '../index.js'
import { opts } from '../index.js'
import { SrvRequest } from '../index.js'
import { urlPath } from '../index.js'
import { H } from '../index.js'
import { Media } from '../index.js'
import { SC } from '../index.js'
import { get } from '../builder.js'
import { created, ok } from '../reply/index.js'

describe('Custom Middlewares', function () {
  function customMiddleware(req: SrvRequest, res: Response, next: NextFunction) {
    req.locals.hello = 'world'
    next()
  }

  function customMiddlewareForRoute(req: SrvRequest, res: Response, next: NextFunction) {
    req.locals.good = 'morning'
    next()
  }

  const $ = httpMock(
    opts().dynamicHttpPort().trace().use(customMiddleware).use('/hey', customMiddlewareForRoute),
  )

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  describe('when providing a custom middleware without a specific route', function () {
    it('should apply it in all routes', function () {
      $.mock(
        get(urlPath('/test'))
          .expect((request: SrvRequest) => request.locals.hello === 'world' && !request.locals.good)
          .reply(ok()),
      )

      return Supertest($.listener()).get('/test').set(H.ContentType, Media.JSON).expect(SC.OK)
    })
  })

  describe('when providing a custom middleware for a specific route', function () {
    it('should apply it in that specific route', async function () {
      $.mock(
        get(urlPath('/test'))
          .expect((request: SrvRequest) => request.locals.hello === 'world' && !request.locals.good)
          .reply(ok()),
      )

      $.mock(
        get(urlPath('/hey'))
          .expect(
            (request: SrvRequest) =>
              request.locals.hello === 'world' && request.locals.good === 'morning',
          )
          .reply(created()),
      )

      await Supertest($.listener()).get('/test').set(H.ContentType, Media.JSON).expect(SC.OK)

      await Supertest($.listener()).get('/hey').set(H.ContentType, Media.JSON).expect(SC.Created)
    })
  })
})
