import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const internalServerError = (): DecoratedResponseBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  internalServerError().bodyJSON(body)
