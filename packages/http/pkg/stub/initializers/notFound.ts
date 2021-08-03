import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const notFound = <
  SF extends HttpServerFactory,
  C extends Configurations<SF>
>(): HttpResponseDefinitionBuilder<SF, C> => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>
): HttpResponseDefinitionBuilder<SF, C> => notFound().bodyJSON(body)
