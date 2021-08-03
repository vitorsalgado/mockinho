import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const forbidden = <
  SF extends HttpServerFactory,
  C extends Configurations<SF>
>(): HttpResponseDefinitionBuilder<SF, C> => response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>
): HttpResponseDefinitionBuilder<SF, C> => forbidden().bodyJSON(body)
