import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { mockRpc } from '@mockdog/grpc'
import { options } from '@mockdog/grpc'
import { jsonPath } from '@mockdog/grpc'
import { equalsTo } from '@mockdog/grpc'
import { RpcMockBuilder } from '@mockdog/grpc'
import { UnaryResponseBuilder } from '@mockdog/grpc'
import { buildFastify } from './app'
import { getPackageDefinition } from './app'

describe('gRPC Example', function () {
  const $ = mockRpc(options().address('0.0.0.0:0').packageDefinition(getPackageDefinition()))

  let fastify: FastifyInstance

  beforeAll(async () => {
    await $.start()

    fastify = buildFastify({}, { grpcAddress: $.serverInfo().address })

    await fastify.ready()
  })

  afterAll(async () => {
    await $.finalize()
    await fastify.close()
  })

  it('should ', function () {
    $.mock(
      RpcMockBuilder.newBuilder()
        .requestData(jsonPath('name', equalsTo('sao-paulo')))
        .reply(
          new UnaryResponseBuilder().data({
            name: 'sao paulo',
            country: 'brasil',
            location: { latitude: 20, longitude: 10 },
          }),
        ),
    )

    return supertest(fastify.server)
      .get('/cities/sao-paulo')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .expect(response => {
        expect(response.body.name).toEqual('sao paulo')
        expect(response.body.country).toEqual('brasil')
      })
      .expect(200)
  })
})
