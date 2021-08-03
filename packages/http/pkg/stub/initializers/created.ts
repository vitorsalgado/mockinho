import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'

export const created = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  location?: string
): HttpResponseDefinitionBuilder<SF, C> =>
  HttpResponseDefinitionBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  body: Record<string, unknown>,
  location?: string
): HttpResponseDefinitionBuilder<SF, C> => created(location).bodyJSON(body)
