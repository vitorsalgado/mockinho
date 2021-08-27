import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const internalServerError = (): DefaultResponseBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  internalServerError().bodyJSON(body)