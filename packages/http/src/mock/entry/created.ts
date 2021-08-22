import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'

export const created = (location?: string): DecoratedResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (
  body: Record<string, unknown>,
  location?: string
): DecoratedResponseBuilder => created(location).bodyJSON(body)
