import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'

export const created = (location?: string): DecoratedResponseBuilder =>
  HttpResponseDefinitionBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (
  body: Record<string, unknown>,
  location?: string
): DecoratedResponseBuilder => created(location).bodyJSON(body)
