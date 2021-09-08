import fastify from 'fastify'
import { FastifyServerOptions } from 'fastify'
import { FastifyInstance } from 'fastify'
import { ContentType } from 'drizzle-http'
import { Accept } from 'drizzle-http'
import { Query } from 'drizzle-http'
import { GET } from 'drizzle-http'
import { theTypes } from 'drizzle-http'
import { MediaTypes } from 'drizzle-http'
import { initDrizzleHttp } from 'drizzle-http'
import { UndiciCallFactory } from 'drizzle-http'

@ContentType(MediaTypes.APPLICATION_JSON_UTF8)
@Accept(MediaTypes.APPLICATION_JSON_UTF8)
class Api {
  @GET('/deputados')
  deputies(
    @Query('siglaPartido') party: string | null = null
  ): Promise<{ dados: [{ id: string; nome: string }] }> {
    return theTypes(Promise, null, party)
  }
}

interface Config {
  api: string
}

export function buildFastify(opts: FastifyServerOptions, config: Config): FastifyInstance {
  const api: Api = initDrizzleHttp()
    .baseUrl(config.api)
    .callFactory(UndiciCallFactory.DEFAULT)
    .build()
    .create(Api)

  const app = fastify(opts)

  app.get('/deputies', (request, reply) =>
    api
      .deputies((request.query as { party: string }).party)
      .then(result => reply.status(200).send(result.dados))
      .catch((error: Error) => reply.status(500).send({ message: error.message }))
  )

  return app
}
