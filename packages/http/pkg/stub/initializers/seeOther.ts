import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'
import { response } from './response'

export const seeOther = <SF extends HttpServerFactory, C extends Configurations<SF>>(
  location?: string
): HttpResponseDefinitionBuilder<SF, C> =>
  response().status(StatusCodes.SEE_OTHER).headerLocation(location)
