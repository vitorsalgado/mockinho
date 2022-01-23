import supertest from 'supertest'
import { FastifyInstance } from 'fastify'
import { get } from '@mockdog/http'
import { Headers } from '@mockdog/http'
import { okJSON } from '@mockdog/http'
import { MediaTypes } from '@mockdog/http'
import { contains } from '@mockdog/http'
import { equalsTo } from '@mockdog/http'
import { buildFastify } from './app'

describe('HTTP Jest Environment Test', function () {
  let fastify: FastifyInstance

  beforeAll(async () => {
    fastify = buildFastify({}, { api: mockhttp.serverInfo().http.baseUrl })
    await fastify.ready()
  })

  afterAll(async () => {
    await fastify.close()
  })

  it('should mock api request/response', async function () {
    mockhttp.mock(
      get('/deputados')
        .query('siglaPartido', equalsTo('pt'))
        .header(Headers.ContentType, contains('json'))
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
