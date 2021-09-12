import { JsonType } from '@mockinho/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const internalServerError = (): ResponseBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (body: JsonType): ResponseBuilder =>
  internalServerError().bodyJSON(body)
