import { DefaultResponseBuilder } from '../../types'
import { JsonType } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const unprocessableEntity = (): DefaultResponseBuilder =>
  response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = (body: JsonType): DefaultResponseBuilder =>
  unprocessableEntity().bodyJSON(body)
