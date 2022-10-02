import { Headers, Methods, StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const methodNotAllowed = (allows?: Methods): ResponseBuilder => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
