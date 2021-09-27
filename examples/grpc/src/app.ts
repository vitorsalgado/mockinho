import Path from 'path'
import fastify from 'fastify'
import { FastifyServerOptions } from 'fastify'
import { FastifyInstance } from 'fastify'
import * as grpc from '@grpc/grpc-js'
import * as ProtoLoader from '@grpc/proto-loader'

const paths = [
  Path.join(process.cwd(), 'protos', 'chat.proto'),
  Path.join(process.cwd(), 'protos', 'cities.proto')
]
const packageDefinition = ProtoLoader.loadSync(paths, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const services = grpc.loadPackageDefinition(packageDefinition) as any

interface Config {
  grpcAddress: string
}

export function buildFastify(opts: FastifyServerOptions, config: Config): FastifyInstance {
  const client = new services.CitiesService(config.grpcAddress, grpc.credentials.createInsecure())
  const app = fastify(opts)

  app.get('/cities/{name}', (request, reply) =>
    client.getCity({ name: (request.params as any).name }, city => reply.send(city).status(200))
  )

  return app
}
