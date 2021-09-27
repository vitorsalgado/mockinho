import { FastifyInstance } from 'fastify'
import { mockRpc } from '@mockdog/grpc'
import { options } from '@mockdog/grpc'
import { buildFastify } from '@mockdog/example-http/dist/app'
import { getPackageDefinition } from './grpc_server'

describe('gRPC Example', function () {
  const $ = mockRpc(options().address('0.0.0.0:50052').packageDefinition(getPackageDefinition()))

  let fastify: FastifyInstance

  beforeAll(async () => {
    await $.start()

    fastify = buildFastify({}, { api: $.serverInfo().address })

    await fastify.ready()
  })

  afterAll(async () => {
    await $.finalize()
    await fastify.close()
  })

  it('should ', function () {
    //
  })
})
