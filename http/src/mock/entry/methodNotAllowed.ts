import { Headers } from '../../Headers.js'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { Methods } from '../../Methods.js'
import { response } from './response.js'

export const methodNotAllowed = (allows?: Methods): ResponseBuilder => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
