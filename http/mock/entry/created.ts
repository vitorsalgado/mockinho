import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'

export const created = (location?: string): ResponseBuilder =>
  ResponseBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (body: JsonType, location?: string): ResponseBuilder =>
  created(location).bodyJSON(body)
