import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const unprocessableEntity = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = (
  body: BodyType | Record<string, unknown>
): HttpResponseDefinitionBuilder => unprocessableEntity().bodyJSON(body)
