import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'

export const created = (location?: string): HttpResponseDefinitionBuilder =>
  HttpResponseDefinitionBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (
  body: Record<string, unknown>,
  location?: string
): HttpResponseDefinitionBuilder => created(location).bodyJSON(body)
