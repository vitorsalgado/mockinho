import { DefaultResponseBuilder } from '../../types'
import { Headers } from '../../Headers'
import { StatusCodes } from '../../StatusCodes'
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
