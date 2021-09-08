import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'
import { response } from './response'

export const internalServerError = (): DefaultResponseBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (body: JsonType): DefaultResponseBuilder =>
  internalServerError().bodyJSON(body)
