import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const unprocessableEntity = (): DecoratedResponseBuilder =>
  response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  unprocessableEntity().bodyJSON(body)
