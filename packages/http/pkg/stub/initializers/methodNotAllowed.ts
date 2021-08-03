import { Headers, HttpMethods, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const methodNotAllowed = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  allows?: HttpMethods
): HttpResponseDefinitionBuilder<SF, C> => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
