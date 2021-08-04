import { Headers, StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const unauthorized = (wwwAuth?: string): DecoratedResponseBuilder => {
  const builder = response().status(StatusCodes.UNAUTHORIZED)

  if (wwwAuth) {
    return builder.header(Headers.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = (
  body: Record<string, unknown>,
  wwwAuth?: string
): DecoratedResponseBuilder => unauthorized(wwwAuth).bodyJSON(body)
