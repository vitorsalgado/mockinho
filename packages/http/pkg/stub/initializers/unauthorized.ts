import { Headers, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const unauthorized = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  wwwAuth?: string
): HttpResponseDefinitionBuilder<SF, C> => {
  const builder = response().status(StatusCodes.UNAUTHORIZED)

  if (wwwAuth) {
    return builder.header(Headers.Authenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>,
  wwwAuth?: string
): HttpResponseDefinitionBuilder<SF, C> => unauthorized(wwwAuth).bodyJSON(body)
