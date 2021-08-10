import { Headers, HttpMethods, StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const methodNotAllowed = (allows?: HttpMethods): DecoratedResponseBuilder => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
