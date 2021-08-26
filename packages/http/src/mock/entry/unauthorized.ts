import { Headers, StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const unauthorized = (wwwAuth?: string): DefaultResponseBuilder => {
  const builder = response().status(StatusCodes.UNAUTHORIZED)

  if (wwwAuth) {
    return builder.header(Headers.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = (
  body: Record<string, unknown>,
  wwwAuth?: string
): DefaultResponseBuilder => unauthorized(wwwAuth).bodyJSON(body)
