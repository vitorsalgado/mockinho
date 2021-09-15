import Supertest from 'supertest'
import { mockHttp } from '../mockHttp'
import { opts } from '../config'
import { Plugin } from '../Plugin'
import { get } from '../mock'
import { okJSON } from '../mock'

interface TestOptions {
  name: string
  description: string
}

describe('plugins', function () {
  const $ = mockHttp(opts().dynamicHttpPort())

  afterAll(() => $.finalize())
  afterEach(async () => {
    $.resetMocks()
    await $.close()
  })

  it('should register sync plugin', async function () {
    const plugin: Plugin<TestOptions> = (instance, config, opts) => {
      instance.mock(
        get('/plugin').reply(okJSON({ name: opts?.name, description: opts?.description }))
      )
    }

    $.register(plugin, { name: 'test', description: 'test-description' })

    await $.start()

    await Supertest($.server())
      .get('/plugin')
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toEqual('test')
        expect(body.description).toEqual('test-description')
      })
  })

  it('should register async plugin', async function () {
    const plugin: Plugin<TestOptions> = (instance, config, opts) =>
      new Promise(resolve => {
        setTimeout(() => {
          instance.mock(
            get('/plugin-async').reply(okJSON({ name: opts?.name, description: opts?.description }))
          )
          resolve()
        }, 500)
      })

    $.register(plugin, { name: 'test-async', description: 'test-description-async' })

    await $.start()

    await Supertest($.server())
      .get('/plugin-async')
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toEqual('test-async')
        expect(body.description).toEqual('test-description-async')
      })
  })

  it('should register multiple plugins', async function () {
    const syncPlugin: Plugin<TestOptions> = (instance, config, opts) => {
      instance.mock(
        get('/plugin').reply(okJSON({ name: opts?.name, description: opts?.description }))
      )
    }

    const asyncPlugin: Plugin<TestOptions> = (instance, config, opts) =>
      new Promise(resolve => {
        setTimeout(() => {
          instance.mock(
            get('/plugin-async').reply(okJSON({ name: opts?.name, description: opts?.description }))
          )
          resolve()
        }, 500)
      })

    $.register(syncPlugin, { name: 'test', description: 'test-description' })
    $.register(asyncPlugin, { name: 'test-async', description: 'test-description-async' })

    await $.start()

    await Supertest($.server())
      .get('/plugin')
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toEqual('test')
        expect(body.description).toEqual('test-description')
      })

    await Supertest($.server())
      .get('/plugin-async')
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toEqual('test-async')
        expect(body.description).toEqual('test-description-async')
      })
  })
})
