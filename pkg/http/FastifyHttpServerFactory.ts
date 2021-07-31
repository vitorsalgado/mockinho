import { notNull } from '../../internal/preconditions/notNull'
import { FastifyConfigurations } from './config/FastifyConfigurations'
import { FastifyHttpServer } from './FastifyHttpServer'
import { FastifyRequestHandler } from './FastifyRequestHandler'
import { HttpContext } from './HttpContext'
import { HttpServer, HttpServerFactory } from './HttpServer'

export class FastifyHttpServerFactory implements HttpServerFactory {
  build(context: HttpContext<FastifyHttpServerFactory, FastifyConfigurations>): HttpServer {
    notNull(context)

    return new FastifyHttpServer(
      context.provideConfigurations(),
      new FastifyRequestHandler(context)
    )
  }
}
