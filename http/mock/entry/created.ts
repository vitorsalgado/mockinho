import { JsonType } from '@mockdog/core'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { StatusCodes } from '../../StatusCodes.js'

export const created = (location?: string): ResponseBuilder =>
  ResponseBuilder.newBuilder().headerLocation(location).status(StatusCodes.CREATED)

export const createdJSON = (body: JsonType, location?: string): ResponseBuilder =>
  created(location).bodyJSON(body)
