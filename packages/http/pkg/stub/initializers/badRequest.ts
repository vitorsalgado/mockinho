import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const badRequest = <
  SF extends HttpServerFactory,
  C extends Configurations<SF>
>(): HttpResponseDefinitionBuilder<SF, C> => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>
): HttpResponseDefinitionBuilder<SF, C> => badRequest().bodyJSON(body)
