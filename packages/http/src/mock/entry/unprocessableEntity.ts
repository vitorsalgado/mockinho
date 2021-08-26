import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const unprocessableEntity = (): DefaultResponseBuilder =>
  response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  unprocessableEntity().bodyJSON(body)
