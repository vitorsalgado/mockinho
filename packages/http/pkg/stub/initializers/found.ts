import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const found = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  location?: string
): HttpResponseDefinitionBuilder<SF, C> =>
  response().headerLocation(location).status(StatusCodes.FOUND)
