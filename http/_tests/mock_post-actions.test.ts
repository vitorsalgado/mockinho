import Supertest from 'supertest'
import { httpMock, opts, req } from '../index.js'

describe('post actions', function () {
  const $ = httpMock(opts().dynamicHttpPort().param('test', 'ok'))

  beforeAll(() => $.start())
  afterAll(() => $.finalize())
  afterEach(() => $.resetMocks())

  test('test single sync post action', async function () {
    const spy = jest.fn()

    $.mock(req.get('/test').reply(200).postActions(spy))

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('test sync and async post actions', async function () {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const asyncAction = async () => {
      spy2()
      return Promise.resolve()
    }

    $.mock(req.get('/test').reply(200).postActions(spy1, asyncAction))

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
  })

  test('multiple calls', async function () {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const asyncAction = async () => {
      spy2()
      return Promise.resolve()
    }

    $.mock(req.get('/test').reply(200).postActions(spy1, asyncAction))

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    expect(spy1).toHaveBeenCalledTimes(3)
    expect(spy2).toHaveBeenCalledTimes(3)
  })

  test('using application parameters', async function () {
    const spy = jest.fn()

    $.mock(
      req
        .get('/test')
        .reply(200)
        .postActions(ctx => {
          if (ctx.app.parameters.get('test') === 'ok') {
            spy()
          }
        }),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('using mock scoped parameters', async function () {
    const spy = jest.fn()

    $.mock(
      req
        .get('/test')
        .reply(200)
        .param('hello', 'world')
        .postActions(ctx => {
          if (ctx.mock.parameters.get('hello') === 'world') {
            spy()
          }
        }),
    )

    await Supertest($.listener())
      .get('/test')
      .expect(res => expect(res.status).toEqual(200))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
