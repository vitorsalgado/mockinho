import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const unprocessableEntity = <
  SF extends HttpServerFactory,
  C extends Configurations<SF>
>(): HttpResponseDefinitionBuilder<SF, C> => response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>
): HttpResponseDefinitionBuilder<SF, C> => unprocessableEntity().bodyJSON(body)
