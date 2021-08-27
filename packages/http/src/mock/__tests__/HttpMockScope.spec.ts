import Supertest from 'supertest'
import { opts, PendingHttpMockScopeError, post } from '../..'
import { urlPath } from '../../matchers'
import { get } from '..'
import { okJSON } from '../entry'
import mockaccinoHttp from '../..'

describe('HTTP Scope', function () {
  const $ = mockaccinoHttp(opts().dynamicHttpPort().enableFileMocks(false))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.cleanAll())

  it('isDone() should return true when all mocks where called', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' }))
    )

    const otherScope = $.mock(
      get(urlPath('/some-other-mock')).reply(okJSON({ data: 'outside mock' }))
    )

    expect(scope.isDone()).toBeFalsy()
    expect(scope.pendingMocks()).toHaveLength(2)

    await Supertest($.server())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    expect(scope.isDone()).toBeFalsy()
    expect(scope.pendingMocks()).toHaveLength(1)

    await Supertest($.server()).get('/other-test').expect(500)

    expect(scope.isDone()).toBeFalsy()
    expect(scope.pendingMocks()).toHaveLength(1)

    await Supertest($.server())
      .post('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('post ok'))

    expect(scope.isDone()).toBeTruthy()
    expect(scope.pendingMocks()).toHaveLength(0)
    expect(() => scope.ensureIsDone()).not.toThrowError()
    expect(otherScope.isDone()).toBeFalsy()
    expect(otherScope.pendingMocks()).toHaveLength(1)
  })

  it('should throw error when scope is not done and ensureIsDone() is called', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' }))
    )

    await Supertest($.server())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    expect(() => scope.ensureIsDone()).toThrowError(PendingHttpMockScopeError)
  })

  it('should print pending mocks', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' }))
    )

    expect(() => scope.printPendingMocks()).not.toThrowError()
  })

  it('should not print pending mocks when scope is done', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' }))
    )

    scope.abortPendingMocks()

    expect(() => scope.printPendingMocks()).not.toThrowError()
  })

  it('should abort pending mocks when abortPendingMocks() is called', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' }))
    )

    await Supertest($.server())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    expect(scope.isDone()).toBeFalsy()
    expect(scope.pendingMocks()).toHaveLength(1)

    scope.abortPendingMocks()

    await Supertest($.server()).post('/test').expect(500)

    expect(scope.isDone()).toBeTruthy()
    expect(scope.pendingMocks()).toHaveLength(0)
  })

  it('should remove all mocks when calling .clean()', async function () {
    const scope = $.mock(
      get(urlPath('/test')).reply(okJSON({ data: 'get ok' })),
      post(urlPath('/test')).reply(okJSON({ data: 'post ok' }))
    )

    await Supertest($.server())
      .get('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('get ok'))

    await Supertest($.server())
      .post('/test')
      .expect(200)
      .expect(res => expect(res.body.data).toEqual('post ok'))

    scope.clean()

    await Supertest($.server()).get('/test').expect(500)

    await Supertest($.server()).post('/test').expect(500)

    expect(scope.pendingMocks()).toHaveLength(0)
    expect(scope.isDone()).toBeTruthy()
  })
})
