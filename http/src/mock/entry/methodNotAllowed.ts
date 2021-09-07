import { HttpMethods } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { Headers } from '../../Headers'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const methodNotAllowed = (allows?: HttpMethods): DefaultResponseBuilder => {
  const builder = response().status(StatusCodes.METHOD_NOT_ALLOWED)

  if (allows) {
    return builder.header(Headers.Allow, allows)
  }

  return builder
}
