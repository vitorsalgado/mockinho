import { DefaultResponseBuilder } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'
import { StatusCodes } from '../../StatusCodes'

export const created = (location?: string): DefaultResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (
  body: Record<string, unknown>,
  location?: string
): DefaultResponseBuilder => created(location).bodyJSON(body)
