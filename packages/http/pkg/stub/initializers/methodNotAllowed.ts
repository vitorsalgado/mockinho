import { Headers, HttpMethods, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const methodNotAllowed = (allows?: HttpMethods): HttpResponseDefinitionBuilder => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
