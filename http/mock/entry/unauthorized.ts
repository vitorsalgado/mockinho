import { JsonType } from '@mockdog/core'
import { Headers } from '../../Headers.js'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const unauthorized = (wwwAuth?: string): ResponseBuilder => {
  const builder = response().status(StatusCodes.UNAUTHORIZED)

  if (wwwAuth) {
    return builder.header(Headers.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = (body: JsonType, wwwAuth?: string): ResponseBuilder =>
  unauthorized(wwwAuth).bodyJSON(body)