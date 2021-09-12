import { Headers } from '../../Headers'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { Methods } from '../../Methods'
import { response } from './response'

export const methodNotAllowed = (allows?: Methods): ResponseBuilder => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
