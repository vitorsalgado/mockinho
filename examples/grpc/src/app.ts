import Path from 'path'
import fastify from 'fastify'
import { FastifyServerOptions } from 'fastify'
import { FastifyInstance } from 'fastify'
import * as grpc from '@grpc/grpc-js'
import * as ProtoLoader from '@grpc/proto-loader'
import { PackageDefinition } from '@grpc/proto-loader'

const paths = [
  Path.join(process.cwd(), 'protos', 'chat.proto'),
  Path.join(process.cwd(), 'protos', 'cities.proto'),
]
const packageDefinition = ProtoLoader.loadSync(paths, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const services = grpc.loadPackageDefinition(packageDefinition) as any

interface Config {
  grpcAddress: string
}

interface CityRequest {
  name: string
}

export function getPackageDefinition(): PackageDefinition {
  return packageDefinition
}

export function buildFastify(opts: FastifyServerOptions, config: Config): FastifyInstance {
  const client = new services.cities.CitiesService(
    config.grpcAddress,
    grpc.credentials.createInsecure(),
  )
  const app = fastify(opts)

  app.get('/cities/:name', (request, reply) => {
    client.getCity(
      { name: (request.params as CityRequest).name },
      (error, value, _trailer, _flags): void => {
        if (error) {
          reply.send({ message: error.message, code: error.code, details: error.details })
          return
        }

        reply.send(value).status(200)
      },
    )
  })

  return app
}
