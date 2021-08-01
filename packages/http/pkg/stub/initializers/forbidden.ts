import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const forbidden = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = (body: Record<string, unknown>): HttpResponseDefinitionBuilder =>
  forbidden().bodyJSON(body)
