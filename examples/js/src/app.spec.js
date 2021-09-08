const {
  mockHttp,
  get,
  equalsTo,
  containing,
  okJSON,
  Headers,
  MediaTypes,
  opts
} = require('@mockinho/http')
const buildFastify = require('./app')
const supertest = require('supertest')

describe('Js Example', function () {
  const $ = mockHttp(opts().dynamicHttpPort())
  let fastify

  beforeAll(async () => {
    await $.start()

    fastify = buildFastify({}, { api: $.info().http.baseUrl })

    await fastify.ready()
  })

  afterAll(async () => {
    await $.finalize()
    await fastify.close()
  })

  it('should mock api request/response', async function () {
    $.mock(
      get('/deputados')
        .query('siglaPartido', equalsTo('pt'))
        .header(Headers.ContentType, containing('json'))
        .reply(
          okJSON({ dados: [{ id: 'test-id', nome: 'test-name' }] }).header(
            Headers.ContentType,
            MediaTypes.APPLICATION_JSON
          )
        )
    )

    await supertest(fastify.server)
      .get('/deputies')
      .query({ party: 'pt' })
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual([{ id: 'test-id', nome: 'test-name' }])
        expect(response.header['content-type']).toContain('json')
      })
  })
})
