import Supertest from 'supertest'
import { opts } from '../config/index.js'
import { urlPath } from '../feat/matchers/index.js'
import { httpMock } from '../index.js'
import { get, post } from '../builder.js'
import { okJSON } from '../reply/index.js'
import { AppVars } from '../_internal/vars.js'

describe('Scope', function () {
  const $ = httpMock(opts().dynamicHttpPort().enableFileMocks(false))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  it('hasBeenCalled() should return true when all mocks where called', async function () {
    const scope = $.mock([
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' })),
    ])

    const otherScope = $.mock(
      get(urlPath('/some-other-mock')).reply(okJSON({ data: 'outside mock' })),
    )

    expect(scope.hasBeenCalled()).toBeFalsy()
    expect(scope.findPending()).toHaveLength(2)

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    expect(scope.hasBeenCalled()).toBeFalsy()
    expect(scope.findPending()).toHaveLength(1)

    await Supertest($.listener()).get('/other-test').expect(AppVars.NoMatchStatus)

    expect(scope.hasBeenCalled()).toBeFalsy()
    expect(scope.findPending()).toHaveLength(1)

    await Supertest($.listener())
      .post('/test')
      //.expect(200)
      .expect(res => expect(res.body.data).toEqual('post ok'))

    expect(scope.hasBeenCalled()).toBeTruthy()
    expect(scope.findPending()).toHaveLength(0)
    expect(() => scope.assertCalled()).not.toThrowError()
    expect(otherScope.hasBeenCalled()).toBeFalsy()
    expect(otherScope.findPending()).toHaveLength(1)
  })

  it('should throw error when scope is not done and ensurehasBeenCalled() is called', async function () {
    const scope = $.mock([
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' })),
    ])

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    expect(() => scope.assertCalled()).toThrowError()
  })

  it('should print pending mocks', async function () {
    const scope = $.mock([
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' })),
    ])

    expect(() => scope.printPending()).not.toThrowError()
  })

  it('should remove all mocks when calling .clean()', async function () {
    const scope = $.mock([
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' })),
    ])

    await Supertest($.listener())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    await Supertest($.listener())
      .post('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('post ok'))

    scope.clean()

    await Supertest($.listener()).get('/test').expect(AppVars.NoMatchStatus)

    await Supertest($.listener()).post('/test').expect(AppVars.NoMatchStatus)

    expect(scope.findPending()).toHaveLength(0)
    expect(scope.hasBeenCalled()).toBeTruthy()
  })
})
