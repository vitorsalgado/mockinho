import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const internalServerError = <
  SF extends HttpServerFactory,
  C extends Configurations<SF>
>(): HttpResponseDefinitionBuilder<SF, C> => response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>
): HttpResponseDefinitionBuilder<SF, C> => internalServerError().bodyJSON(body)
