import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const badRequest = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: Record<string, unknown>): HttpResponseDefinitionBuilder =>
  badRequest().bodyJSON(body)