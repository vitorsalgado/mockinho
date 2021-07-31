import { BodyType, Headers, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const unauthorized = (wwwAuth?: string): HttpResponseDefinitionBuilder => {
  const builder = response().status(StatusCodes.UNAUTHORIZED)

  if (wwwAuth) {
    return builder.header(Headers.Authenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = (
  body: BodyType | Record<string, unknown>,
  wwwAuth?: string
): HttpResponseDefinitionBuilder => unauthorized(wwwAuth).bodyJSON(body)
