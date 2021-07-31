import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const notFound = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (
  body: BodyType | Record<string, unknown>
): HttpResponseDefinitionBuilder => notFound().bodyJSON(body)
