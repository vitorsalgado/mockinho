import { JsonType } from '@mockdog/core'
import { Headers } from '../../Headers'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const unauthorized = (wwwAuth?: string): ResponseBuilder => {
  const builder = response().status(StatusCodes.UNAUTHORIZED)

  if (wwwAuth) {
    return builder.header(Headers.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = (body: JsonType, wwwAuth?: string): ResponseBuilder =>
  unauthorized(wwwAuth).bodyJSON(body)
