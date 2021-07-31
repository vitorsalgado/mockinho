import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const internalServerError = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (
  body: BodyType | Record<string, unknown>
): HttpResponseDefinitionBuilder => internalServerError().bodyJSON(body)
