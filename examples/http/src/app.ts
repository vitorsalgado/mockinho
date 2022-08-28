import fastify from 'fastify'
import { FastifyServerOptions } from 'fastify'
import { FastifyInstance } from 'fastify'
import { ContentType, newAPI, noop } from 'drizzle-http'
import { Accept } from 'drizzle-http'
import { Query } from 'drizzle-http'
import { GET } from 'drizzle-http'
import { MediaTypes } from 'drizzle-http'
import { UndiciCallFactory } from 'drizzle-http'

@ContentType(MediaTypes.APPLICATION_JSON)
@Accept(MediaTypes.APPLICATION_JSON)
class Api {
  @GET('/deputados')
  deputies(
    @Query('siglaPartido') party: string | null = null,
  ): Promise<{ dados: [{ id: string; nome: string }] }> {
    return noop(party)
  }
}

interface Config {
  api: string
}

export function buildFastify(opts: FastifyServerOptions, config: Config): FastifyInstance {
  const api: Api = newAPI()
    .baseUrl(config.api)
    .callFactory(new UndiciCallFactory())
    .build()
    .create(Api)

  const app = fastify(opts)

  app.get('/deputies', (request, reply) =>
    api
      .deputies((request.query as { party: string }).party)
      .then(result => reply.status(200).send(result.dados))
      .catch((error: Error) => reply.status(500).send({ message: error.message })),
  )

  return app
}
