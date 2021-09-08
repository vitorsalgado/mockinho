import { DefaultResponseBuilder } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'

export const created = (location?: string): DefaultResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (body: JsonType, location?: string): DefaultResponseBuilder =>
  created(location).bodyJSON(body)
