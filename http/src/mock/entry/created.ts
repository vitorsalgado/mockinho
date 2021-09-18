import { JsonType } from '@mockdog/core'
import { ResponseBuilder } from '../ResponseBuilder'
import { StatusCodes } from '../../StatusCodes'

export const created = (location?: string): ResponseBuilder =>
  ResponseBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (body: JsonType, location?: string): ResponseBuilder =>
  created(location).bodyJSON(body)
